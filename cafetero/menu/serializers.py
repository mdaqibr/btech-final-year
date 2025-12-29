from rest_framework import serializers
from menu import models as menu_models

class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = menu_models.FoodItem
        fields = [
            "id","name","description","type",
            "category","base_price_cents","created_at"
        ]

class VendorBranchFoodSerializer(serializers.ModelSerializer):
    food_name = serializers.CharField(source="food.name", read_only=True)
    description = serializers.CharField(source="food.description", read_only=True)
    base_price_cents = serializers.IntegerField(source="food.base_price_cents", read_only=True)

    class Meta:
        model = menu_models.VendorBranchFood
        fields = [
            "id",
            "vendor_branch",
            "food",
            "food_name",
            "description",
            "base_price_cents",
            "branch_level_price_override_cents",
        ]
        read_only_fields = ["vendor_branch"]

class FloorFoodSerializer(serializers.ModelSerializer):
    food_name = serializers.CharField(source="vendor_branch_food.food.name", read_only=True)
    food_price_cents = serializers.IntegerField(
        source="vendor_branch_food.food.base_price_cents", read_only=True
    )

    vendor_branch_food = serializers.PrimaryKeyRelatedField(
        queryset=menu_models.VendorBranchFood.objects.all(), required=False
    )

    class Meta:
        model = menu_models.FloorFood
        fields = [
            "id",
            "floor",
            "vendor_branch_food",
            "food_name",
            "food_price_cents",
            "floor_level_price_override_cents",
            "name_override",
            "description_override",
            "default_quantity",
        ]
        extra_kwargs = {
            "floor": {"read_only": True},
        }

    def validate_vendor_branch_food(self, vbf):
        user = self.context["request"].user
        if vbf.vendor_branch.vendor.user != user:
            raise serializers.ValidationError("Not your food")
        return vbf

class DailyMenuItemSerializer(serializers.ModelSerializer):
    food_name = serializers.CharField(source="floor_food.vendor_branch_food.food.name", read_only=True)
    base_price_cents = serializers.IntegerField(source="floor_food.vendor_branch_food.food.base_price_cents", read_only=True)

    class Meta:
        model = menu_models.DailyMenuItem
        fields = [
            "id",
            "daily_menu",
            "floor_food",
            "food_name",
            "base_price_cents",
            "is_available",
            "remaining_quantity",
            "special_price_override_cents",
            "special_name_override",
        ]

class DailyMenuSerializer(serializers.ModelSerializer):
    daily_items = DailyMenuItemSerializer(many=True, read_only=True)

    class Meta:
        model = menu_models.DailyMenu
        fields = ["id", "floor", "week_day", "daily_items"]