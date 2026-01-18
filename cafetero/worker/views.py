# worker/views.py
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from worker.serializers import WorkerLoginSerializer
from worker.authentication import WorkerJWTAuthentication
from rest_framework.permissions import IsAuthenticated
from order import models as order_models
from menu import models as menu_models

class WorkerLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = WorkerLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        worker = serializer.validated_data["worker"]

        refresh = RefreshToken()
        refresh["user_id"] = worker.id # because simpleJWt uses user_id.
        refresh["type"] = "Worker"
        refresh["floor_id"] = worker.company_floor.id

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": worker.id,
                "user_type": "Worker",
                "name": worker.name,
                "floor": worker.company_floor.id
            }
        })

class WorkerTokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = RefreshToken(request.data["refresh"])

        if token.get("type") != "Worker":
            return Response({"error": "Invalid worker token"}, status=403)

        return Response({"access": str(token.access_token)})

class TodayConfirmedOrdersView(APIView):
    authentication_classes = [WorkerJWTAuthentication]

    def get(self, request):
        worker = request.user
        print("worker: ", worker)

        # Filter orders where items belong to the worker's floor
        orders = order_models.Order.objects.filter(
            items__daily_menu_item__daily_menu__floor=worker.company_floor,
            status__in=["CONFIRMED","PREPARING"]
        ).select_related("user").prefetch_related(
            "items__daily_menu_item__floor_food__vendor_branch_food__food"
        ).distinct()  # distinct to avoid duplicates if multiple items per order

        data = []
        for o in orders:
            items = []
            for i in o.items.all():
                floor_food = i.daily_menu_item.floor_food
                food_name = floor_food.name_override or floor_food.vendor_branch_food.food.name
                items.append({
                    "name": food_name,
                    "qty": i.quantity
                })
            data.append({
                "id": o.id,
                "customer": o.user.email,
                "total": o.total_amount_cents,
                "status": o.status,
                "created_at": o.created_at,
                "items": items
            })

        return Response(data)

class WorkerUpdateOrderStatusView(APIView):
    authentication_classes = [WorkerJWTAuthentication]

    def post(self, request, pk):
        worker = request.user

        # Get the order only if it has items on the worker's floor
        order = (
            order_models.Order.objects.filter(
                id=pk,
                items__daily_menu_item__daily_menu__floor=worker.company_floor
            )
            .distinct()
            .first()
        )

        if not order:
            return Response(
                {"error": "Order not found or not on your floor"}, status=404
            )

        # Update order status
        if order.status == "CONFIRMED":
            order.status = "PREPARING"
        elif order.status == "PREPARING":
            order.status = "READY"
        else:
            return Response({"error": "Invalid state"}, status=400)

        order.save()

        return Response({"success": True, "status": order.status})

class WorkerTodayMenuView(APIView):
    authentication_classes = [WorkerJWTAuthentication]

    def get(self, request):
        worker = request.user
        today = timezone.now().strftime("%A").lower()

        qs = (
            menu_models.DailyMenuItem.objects.filter(
                daily_menu__floor=worker.company_floor,
                daily_menu__week_day=today,
            )
            .select_related(
                "floor_food__vendor_branch_food__food"
            )
            .order_by("floor_food__vendor_branch_food__food__name")
        )

        data = []
        for item in qs:
            food = item.floor_food.vendor_branch_food.food
            data.append({
                "id": item.id,
                "name": item.special_name_override or food.name,
                "type": food.type,
                "is_available": item.is_available,
            })

        return Response(data)

class WorkerToggleMenuAvailabilityView(APIView):
    authentication_classes = [WorkerJWTAuthentication]

    def post(self, request, pk):
        worker = request.user
        today = timezone.now().strftime("%A").lower()

        item = (
            menu_models.DailyMenuItem.objects.filter(
                id=pk,
                daily_menu__floor=worker.company_floor,
                daily_menu__week_day=today,
            )
            .first()
        )

        if not item:
            raise PermissionDenied("Menu item not found")

        item.is_available = not item.is_available
        item.save(update_fields=["is_available"])

        return Response({
            "success": True,
            "is_available": item.is_available
        })
