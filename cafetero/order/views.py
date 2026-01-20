import hmac
import hashlib
import json
from django.db.models import Avg, Count, Sum
from django.utils import timezone
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
from menu import models as menu_models
from rest_framework.pagination import PageNumberPagination

class MyOrdersPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = "page_size"

class FoodFeedbackPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = "page_size"
    max_page_size = 20

class AddToCartView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def post(self, request):
        item_id = request.data.get("item_id")
        qty = int(request.data.get("qty", 1))

        if not item_id:
            return Response(
                {"detail": "Item id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            menu_item = menu_models.DailyMenuItem.objects.get(id=item_id)
        except menu_models.DailyMenuItem.DoesNotExist:
            return Response(
                {"detail": "Menu item not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not menu_item.is_available:
            return Response(
                {
                    "detail": "This item is no longer available. Please refresh the menu."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart, _ = order_models.Cart.objects.get_or_create(user=request.user)

        cart_item, created = order_models.CartItem.objects.get_or_create(
            cart=cart,
            daily_menu_item=menu_item,
        )

        if created:
            cart_item.quantity = qty
        else:
            cart_item.quantity += qty

        cart_item.save()

        return Response(
            {"message": "Item added to cart"},
            status=status.HTTP_200_OK,
        )
      
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

# order/views.py
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

        print("selected_ids: ", selected_ids)

        cart_items = request.user.cart.items.filter(id__in=selected_ids).select_for_update()

        if not cart_items.exists():
            raise ValidationError("Invalid cart selection")

        total = 0
        for item in cart_items:
            if not item.daily_menu_item.is_available:
                raise ValidationError(f"{item.daily_menu_item.special_name_override} unavailable")
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

        print("RESPONSE: ", r.json())
        order.save()

        print("RAZORPAY_KEY_ID: ", settings.RAZORPAY_KEY_ID)

        return Response({
            "order_id": order.id,
            "razorpay_order_id": order.razorpay_order_id,
            "razorpay_key": settings.RAZORPAY_KEY_ID,
            "amount": total,
            "user": {
                "name": request.user.email,
                "email": request.user.email,
                "phone": request.user.phone if hasattr(request.user, "phone") else "9999999999"
            }
        })

class VerifyPaymentView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def post(self, request):
        data = request.data

        print("verification data:", data)

        print("settings.RAZORPAY_KEY_SECRET.encode(): ", settings.RAZORPAY_KEY_SECRET.encode())
        generated_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            f"{data['razorpay_order_id']}|{data['razorpay_payment_id']}".encode(),
            hashlib.sha256
        ).hexdigest()

        print("GENERATED_SIGNATURE: ", generated_signature)

        if generated_signature != data["razorpay_signature"]:
            raise AuthenticationFailed("Invalid Razorpay Signature")

        print("RAZORPYA_SIGNATURE: ", data["razorpay_signature"])

        order = order_models.Order.objects.get(
            razorpay_order_id=data["razorpay_order_id"]
        )

        print("ORDER_ID: ", data["razorpay_order_id"])

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

        print("PAYLOAD: ", payload)

        expected = hmac.new(
            settings.RAZORPAY_WEBHOOK_SECRET.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()

        print("EXPECTED: ", expected)

        if not hmac.compare_digest(sig, expected):
            raise AuthenticationFailed("Invalid Razorpay Signature")

        order_id = request.data["payload"]["payment"]["entity"]["order_id"]

        print("ORDER ID: ", order_id)

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
            .select_related("feedback")
            .prefetch_related(
                "items__daily_menu_item__floor_food__vendor_branch_food__food"
            )
            .order_by("-created_at")
        )

        paginator = MyOrdersPagination()
        page = paginator.paginate_queryset(orders, request)

        data = []
        for o in page:
            data.append({
                "id": o.id,
                "status": o.status,
                "total": o.total_amount_cents,
                "created_at": o.created_at,
                "feedback": (
                    {
                        "rating": o.feedback.rating,
                        "comment": o.feedback.comment,
                        "created_at": o.feedback.created_at,
                    }
                    if hasattr(o, "feedback") else None
                ),
                "items": [
                    {
                        "name": i.daily_menu_item.floor_food.vendor_branch_food.food.name,
                        "qty": i.quantity,
                        "price": i.price_cents,
                    }
                    for i in o.items.all()
                ],
            })

        return paginator.get_paginated_response(data)

class CancelOrderView(APIView):
    authentication_classes = [AppJWTAuthentication]

    @transaction.atomic
    def post(self, request, order_id):
        try:
            order = order_models.Order.objects.select_for_update().get(
                id=order_id,
                user=request.user
            )
        except order_models.Order.DoesNotExist:
            raise ValidationError("Order not found")

        if order.status != "CONFIRMED":
            raise ValidationError("Only confirmed orders can be cancelled")

        order.status = "CANCELLED"
        order.save()

        return Response({"success": True})

class SubmitOrderFeedbackView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def post(self, request, order_id):
        try:
            order = order_models.Order.objects.get(
                id=order_id,
                user=request.user
            )
        except order_models.Order.DoesNotExist:
            return Response(
                {"detail": "Order not found"},
                status=404
            )

        if order.status not in ["READY", "COMPLETED"]:
            return Response(
                {"detail": "Feedback not allowed yet"},
                status=400
            )

        if hasattr(order, "feedback"):
            return Response(
                {"detail": "Feedback already submitted"},
                status=400
            )

        serializer = sez.OrderFeedbackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save(
            order=order,
            user=request.user
        )

        return Response(
            {"success": True, "message": "Thanks for your feedback!"}
        )

class TodayFeedbackView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def get(self, request):
        today = timezone.now().date()

        feedbacks = (
            order_models.OrderFeedback.objects
            .filter(order__created_at__date=today)
            .select_related("order", "user")
            .order_by("-created_at")
        )

        serializer = sez.TodayFeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data)

class FoodFeedbackView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def get(self, request, food_id):
        feedbacks = (
            order_models.OrderFeedback.objects
            .filter(order__items__daily_menu_item__id=food_id)
            .select_related("order", "user")
            .order_by("-created_at")
            .distinct()
        )

        food = menu_models.FoodItem.objects.filter(id=food_id).first()

        stats = feedbacks.aggregate(
            avg_rating=Avg("rating"),
            total_ratings=Count("id"),
            sum_rating=Sum("rating")
        )

        paginator = FoodFeedbackPagination()
        page = paginator.paginate_queryset(feedbacks, request)

        serializer = sez.FoodFeedbackSerializer(page, many=True)

        return paginator.get_paginated_response({
            "id": food.id if food else None,
            "name": food.name if food else "",
            "avg_rating": round(stats["avg_rating"] or 0, 1),
            "total_ratings": stats["total_ratings"] or 0,
            "sum_rating": stats["sum_rating"] or 0,
            "feedback": serializer.data,
        })