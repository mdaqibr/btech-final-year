import hmac
import hashlib
import json
from django.db import transaction
import requests
from django.conf import settings
from rest_framework.views import APIView
from accounts.authentication import AppJWTAuthentication
from order.auth import ServiceTokenAuthentication
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from order import models as order_models
from accounts import models as account_models
from order import serializers as sez
from rest_framework import status
from menu.models import DailyMenuItem


class AddToCartView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def post(self, request):
        item_id = request.data.get("item_id")
        qty = int(request.data.get("qty", 1))

        cart, _ = order_models.Cart.objects.get_or_create(user=request.user)
        menu_item = DailyMenuItem.objects.get(id=item_id)

        cart_item, created = order_models.CartItem.objects.get_or_create(
            cart=cart, daily_menu_item=menu_item
        )

        if not created:
            cart_item.quantity += qty
        else:
            cart_item.quantity = qty

        cart_item.save()
        return Response({"message": "Item added to cart"})
      
class UpdateCartQtyView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def post(self, request):
        print("request.data: ", request.data)
        cart_item_id = request.data.get("cart_item_id")
        qty = int(request.data.get("qty"))
        
        print("request.user: ", request.user)

        try:
            cart_item = order_models.CartItem.objects.get(
                id=cart_item_id,
                cart__user=request.user
            )
        except order_models.CartItem.DoesNotExist:
            return Response(
                {"error": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        cart_item.quantity = qty
        cart_item.save()

        return Response({"message": "Quantity updated successfully"})

class RemoveFromCartView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def post(self, request):

        print("request.data: ", request.data)
        cart_item_id = request.data.get("cart_item_id")

        deleted, _ = order_models.CartItem.objects.filter(
            id=cart_item_id,
            cart__user=request.user
        ).delete()

        if not deleted:
            return Response(
                {"error": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({"message": "Item removed successfully"})

class GetCartView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def get(self, request):
        cart, _ = order_models.Cart.objects.get_or_create(user=request.user)
        serializer = sez.CartSerializer(cart)
        return Response(serializer.data)

class CreateOrderView(APIView):
    authentication_classes = [AppJWTAuthentication]

    @transaction.atomic
    def post(self, request):
        selected_ids = request.data.get("cart_item_ids", [])

        if not selected_ids:
            raise ValidationError("No items selected")

        cart_items = request.user.cart.items.filter(id__in=selected_ids).select_for_update()

        if not cart_items.exists():
            raise ValidationError("Invalid cart selection")

        total = 0
        for item in cart_items:
            if not item.daily_menu_item.is_available:
                raise ValidationError(f"{item.daily_menu_item.name} unavailable")
            total += item.quantity * item.daily_menu_item.special_price_override_cents

        app_user = account_models.User.objects.select_for_update().get(email=request.user.email)

        order = order_models.Order.objects.create(
            user=app_user,
            total_amount_cents=total
        )

        for item in cart_items:
            order_models.OrderItem.objects.create(
                order=order,
                daily_menu_item=item.daily_menu_item,
                quantity=item.quantity,
                price_cents=item.daily_menu_item.special_price_override_cents
            )

        r = requests.post(
            settings.PAYMENT_SERVICE_URL + "/payments/create-order",
            headers={"X-SERVICE-TOKEN": settings.PAYMENT_SERVICE_TOKEN},
            json={"amount": total}
        )

        order.razorpay_order_id = r.json()["order"]["id"]
        order.save()

        return Response({
            "order_id": order.id,
            "razorpay_order_id": order.razorpay_order_id,
            "razorpay_key": 'rzp_test_S2cRNRFQQod6jm',
            "amount": total,
            "user": {
                "name": request.user.email,
                "email": request.user.email,
                "phone": request.user.phone if hasattr(request.user, "phone") else "9999999999"
            }
        })

class VerifyPaymentView(APIView):
    def post(self, request):
        data = request.data

        generated_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            f"{data['razorpay_order_id']}|{data['razorpay_payment_id']}".encode(),
            hashlib.sha256
        ).hexdigest()

        if generated_signature != data["razorpay_signature"]:
            raise AuthenticationFailed("Invalid Razorpay Signature")

        order = order_models.Order.objects.get(
            razorpay_order_id=data["razorpay_order_id"]
        )
        order.status = "CONFIRMED"
        order.save()

        request.user.cart.items.filter(
            daily_menu_item__in=order.items.values_list("daily_menu_item", flat=True)
        ).delete()

        order_models.PaymentLog.objects.create(
            order=order, payload=data, status="SUCCESS"
        )

        return Response({"success": True})

class PaymentWebhookView(APIView):
    authentication_classes = []

    @transaction.atomic
    def post(self, request):
        sig = request.headers.get("X-Razorpay-Signature")
        payload = json.dumps(request.data, separators=(",", ":"))

        expected = hmac.new(
            settings.RAZORPAY_WEBHOOK_SECRET.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(sig, expected):
            raise AuthenticationFailed("Invalid Razorpay Signature")

        order_id = request.data["payload"]["payment"]["entity"]["order_id"]
        order = order_models.Order.objects.select_for_update().get(
            razorpay_order_id=order_id
        )

        if order.status == "CONFIRMED":
            return Response({"success": True})

        order.status = "CONFIRMED"
        order.save()

        order_models.PaymentLog.objects.create(
            order=order, payload=request.data, status="SUCCESS"
        )

        return Response({"success": True})

class MyOrdersView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def get(self, request):
        orders = (
            order_models.Order.objects
            .filter(user=request.user)
            .prefetch_related(
                "items__daily_menu_item__floor_food__vendor_branch_food__food"
            )
            .order_by("-created_at")
        )

        data = []
        for o in orders:
            data.append({
                "id": o.id,
                "status": o.status,
                "total": o.total_amount_cents,
                "created_at": o.created_at,
                "items": [
                    {
                        "name": i.daily_menu_item.floor_food.vendor_branch_food.food.name,
                        "qty": i.quantity,
                        "price": i.price_cents,
                    }
                    for i in o.items.all()
                ]
            })

        return Response(data)

class UpdateOrderStatusView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def post(self, request, order_id):
        order = order_models.Order.objects.get(id=order_id)

        if order.status == "CONFIRMED":
            order.status = "PREPARING"
        elif order.status == "PREPARING":
            order.status = "READY"

        order.save()

        # send_order_notification(order.user.id, f"Your order is now {order.status}")

        return Response({"success": True, "status": order.status})