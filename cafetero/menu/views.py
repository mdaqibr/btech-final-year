from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView, UpdateAPIView, CreateAPIView, DestroyAPIView
from django.db.models import Q
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from accounts.authentication import AppJWTAuthentication
from rest_framework.exceptions import PermissionDenied
from rest_framework.exceptions import ValidationError
from menu import models as menu_models
from accounts import models as account_models
from menu import serializers as sez
from rest_framework.response import Response
from django.utils import timezone

from datetime import timedelta

class VendorFoodListCreateAPIView(ListCreateAPIView):
    authentication_classes = [AppJWTAuthentication]
    serializer_class = sez.FoodItemSerializer

    def get_queryset(self):
        return menu_models.FoodItem.objects.filter(vendor__user=self.request.user)

    def perform_create(self, serializer):
        vendor = account_models.Vendor.objects.get(user=self.request.user)
        serializer.save(vendor=vendor)


class VendorFoodRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [AppJWTAuthentication]
    serializer_class = sez.FoodItemSerializer

    def get_queryset(self):
        return menu_models.FoodItem.objects.filter(vendor__user=self.request.user)

class VendorBranchFoodListCreateAPIView(ListCreateAPIView):
    authentication_classes = [AppJWTAuthentication]
    serializer_class = sez.VendorBranchFoodSerializer

    def get_queryset(self):
        branch_id = self.kwargs["branch_id"]
        return menu_models.VendorBranchFood.objects.filter(
            vendor_branch_id=branch_id,
            vendor_branch__vendor__user=self.request.user,
        ).select_related("food")

    def perform_create(self, serializer):
        branch_id = self.kwargs["branch_id"]

        # Vendor safety check
        if not serializer.validated_data["food"].vendor.user == self.request.user:
            raise PermissionDenied("Not your food")

        serializer.save(vendor_branch_id=branch_id)


class VendorBranchFoodRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [AppJWTAuthentication]
    serializer_class = sez.VendorBranchFoodSerializer

    def get_queryset(self):
        print("self.request> ", self.request.body)
        return menu_models.VendorBranchFood.objects.filter(
            vendor_branch__vendor__user=self.request.user
        ).select_related("food")

class FloorFoodListCreateAPIView(ListCreateAPIView):
    authentication_classes = [AppJWTAuthentication]
    serializer_class = sez.FloorFoodSerializer

    def get_queryset(self):
        return menu_models.FloorFood.objects.filter(
            floor_id=self.kwargs["floor_id"],
            vendor_branch_food__vendor_branch__vendor__user=self.request.user,
        ).select_related("vendor_branch_food__food")

    def perform_create(self, serializer):
        serializer.save(floor_id=self.kwargs["floor_id"])


class FloorFoodRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [AppJWTAuthentication]
    serializer_class = sez.FloorFoodSerializer

    def get_queryset(self):
        return menu_models.FloorFood.objects.filter(
            vendor_branch_food__vendor_branch__vendor__user=self.request.user
        ).select_related("vendor_branch_food__food")

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

class VendorBranchFoodListAPIView(ListAPIView):
    """
    Get all foods assigned to a vendor branch
    """
    authentication_classes = [AppJWTAuthentication]
    serializer_class = sez.VendorBranchFoodSerializer

    def get_queryset(self):
        branch_id = self.kwargs.get("branch_id")
        user = self.request.user
        return menu_models.VendorBranchFood.objects.filter(
            vendor_branch_id=branch_id,
            vendor_branch__vendor__user=user
        ).select_related("food")

class BranchWeeklyMenuAPIView(ListAPIView):
    authentication_classes = [AppJWTAuthentication]
    serializer_class = sez.DailyMenuSerializer

    def get_queryset(self):
        branch_id = self.kwargs["branch_id"]
        return menu_models.DailyMenu.objects.filter(
            floor__vendor_branch_id=branch_id,
            floor__vendor_branch__vendor__user=self.request.user
        ).select_related("floor").prefetch_related("daily_items__floor_food")

class DailyMenuItemCreateUpdateAPIView(UpdateAPIView):
    authentication_classes = [AppJWTAuthentication]
    serializer_class = sez.DailyMenuItemSerializer
    queryset = menu_models.DailyMenuItem.objects.all()

class GenerateWeeklyMenuAPIView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def post(self, request, branch_id):
        floors = account_models.CompanyFloor.objects.filter(
            vendor_branch_id=branch_id,
            vendor_branch__vendor__user=request.user
        )

        for floor in floors:
            for day in ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]:
                menu, _ = menu_models.DailyMenu.objects.get_or_create(floor=floor, week_day=day)

                for ff in floor.floor_foods.all():
                    menu_models.DailyMenuItem.objects.get_or_create(daily_menu=menu, floor_food=ff)

        return Response({"status": "Weekly menu generated"})

class DailyMenuView(ListAPIView):
    authentication_classes = [AppJWTAuthentication]
    serializer_class = sez.DailyMenuSerializer

    def list(self, request):
        floor_id = request.query_params.get("floor")
        week_day = request.query_params.get("week_day")

        if not floor_id or not week_day:
            raise ValidationError("floor and week_day required")

        menu, _ = menu_models.DailyMenu.objects.get_or_create(
            floor_id=floor_id,
            week_day=week_day,
        )

        # SECURITY
        # if menu.floor.vendor_branch.vendor.user != request.user:
        #     raise PermissionDenied("Not allowed")

        return Response(self.get_serializer(menu).data)

class DailyMenuItemCreateView(CreateAPIView):
    authentication_classes = [AppJWTAuthentication]
    serializer_class = sez.DailyMenuItemSerializer

    def create(self, request, *args, **kwargs):
        daily_menu = request.data.get("daily_menu")
        floor_food = request.data.get("floor_food")

        if not daily_menu or not floor_food:
            raise ValidationError("daily_menu and floor_food required")

        if menu_models.DailyMenuItem.objects.filter(
            daily_menu_id=daily_menu,
            floor_food_id=floor_food
        ).exists():
            raise ValidationError("Food already exists in menu")

        item = menu_models.DailyMenuItem.objects.create(
            daily_menu_id=daily_menu,
            floor_food_id=floor_food,
        )

        return Response(self.get_serializer(item).data)

class DailyMenuItemUpdateView(UpdateAPIView):
    authentication_classes = [AppJWTAuthentication]
    queryset = menu_models.DailyMenuItem.objects.all()
    serializer_class = sez.DailyMenuItemSerializer


class DailyMenuItemDeleteView(DestroyAPIView):
    authentication_classes = [AppJWTAuthentication]
    queryset = menu_models.DailyMenuItem.objects.all()


class DailyMenuItemCreateUpdateView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def post(self, request):
        serializer = sez.DailyMenuItemCreateUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        menu = serializer.validated_data["daily_menu"]

        item, _ = menu_models.DailyMenuItem.objects.update_or_create(
            daily_menu=menu,
            floor_food=serializer.validated_data["floor_food"],
            defaults=serializer.validated_data,
        )
        return Response(sez.DailyMenuItemSerializer(item).data)

    def put(self, request, pk):
        return self._update(request, pk)

    def patch(self, request, pk):
        return self._update(request, pk, partial=True)

    def _update(self, request, pk, partial=False):
        item = get_object_or_404(menu_models.DailyMenuItem, pk=pk)
        serializer = sez.DailyMenuItemCreateUpdateSerializer(
            item, data=request.data, partial=partial
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(sez.DailyMenuItemSerializer(item).data)

# List & Create SpecialFood
class SpecialFoodListCreateView(ListCreateAPIView):
    authentication_classes = [AppJWTAuthentication]
    serializer_class = sez.SpecialFoodSerializer

    def get_queryset(self):
        floor_id = self.request.query_params.get("floor")
        if not floor_id:
            raise ValidationError("floor query param is required")

        seven_days_ago = timezone.now() - timedelta(days=7)
        return menu_models.SpecialFood.objects.filter(
            floor_id=floor_id, available_from__gte=seven_days_ago
        ).order_by("-available_from")

    def perform_create(self, serializer):
        # Use the payload floor and vendor_branch directly
        floor_id = self.request.data.get("floor")
        branch_id = self.request.data.get("vendor_branch")
        if not floor_id:
            raise ValidationError({"floor": "Floor ID is required"})
        if not branch_id:
            raise ValidationError({"vendor_branch": "Vendor Branch ID is required"})
        serializer.save(floor_id=floor_id, vendor_branch_id=branch_id)

# Retrieve, Update, Delete
class SpecialFoodRetrieveUpdateDestroyView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def get_object(self, pk):
        return get_object_or_404(menu_models.SpecialFood, pk=pk)

    def patch(self, request, pk):
        item = self.get_object(pk)
        serializer = sez.SpecialFoodSerializer(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        item = self.get_object(pk)
        item.delete()
        return Response({"status": "deleted"})

# EMP order;
class EmployeeTodayMenuView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def get(self, request):
        floor_id = request.query_params.get("floor")
        vendor_branch_id = request.query_params.get("vendor_branch")
        food_type = request.query_params.get("food_type")
        search = request.query_params.get("search", "")

        today = timezone.now().strftime("%A").lower()

        qs = menu_models.DailyMenuItem.objects.filter(
            daily_menu__floor_id=floor_id,
            daily_menu__week_day=today,
            is_available=True,
            floor_food__vendor_branch_food__vendor_branch_id=vendor_branch_id,
            floor_food__vendor_branch_food__food__type=food_type,
        ).select_related(
            "floor_food__vendor_branch_food__food"
        )

        # SEARCH FILTER
        if search:
            qs = qs.filter(
                Q(special_name_override__icontains=search) |
                Q(floor_food__description_override__icontains=search)
            )

        serializer = sez.DailyMenuItemEmployeeSerializer(qs, many=True)
        return Response(serializer.data)
