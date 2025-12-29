from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView, UpdateAPIView
from rest_framework.views import APIView
from accounts.authentication import AppJWTAuthentication
from rest_framework.exceptions import PermissionDenied
from menu import models as menu_models
from accounts import models as account_models
from menu import serializers as sez
from rest_framework.response import Response

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
        floor_id = self.kwargs["floor_id"]
        return menu_models.FloorFood.objects.filter(
            floor_id=floor_id,
            vendor_branch_food__vendor_branch__vendor__user=self.request.user,
        ).select_related("vendor_branch_food__food")

    def perform_create(self, serializer):
        floor_id = self.kwargs["floor_id"]
        vbf = serializer.validated_data["vendor_branch_food"]

        if vbf.vendor_branch.vendor.user != self.request.user:
            raise PermissionDenied("Not your food")

        serializer.save(floor_id=floor_id)


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
