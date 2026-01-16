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
    food_name = serializers.SerializerMethodField()
    food_description = serializers.SerializerMethodField()
    food_price_cents = serializers.SerializerMethodField()

    vendor_branch_food = serializers.PrimaryKeyRelatedField(
        queryset=menu_models.VendorBranchFood.objects.all()
    )

    class Meta:
        model = menu_models.FloorFood
        fields = [
            "id",
            "floor",
            "vendor_branch_food",
            "food_name",
            "food_description",
            "food_price_cents",
            "floor_level_price_override_cents",
            "name_override",
            "description_override",
            "default_quantity",
        ]
        extra_kwargs = {"floor": {"read_only": True}}

    # ---- RULE IMPLEMENTATION ----
    def get_food_name(self, obj):
        return obj.name_override or obj.vendor_branch_food.food.name

    def get_food_description(self, obj):
        return (
            obj.description_override
            or obj.vendor_branch_food.food.description
        )

    def get_food_price_cents(self, obj):
        return (
            obj.floor_level_price_override_cents
            or obj.vendor_branch_food.branch_level_price_override_cents
            or obj.vendor_branch_food.food.base_price_cents
        )

    def validate_vendor_branch_food(self, vbf):
        if vbf.vendor_branch.vendor.user != self.context["request"].user:
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


class DailyMenuSerializer(serializers.ModelSerializer):
    daily_items = DailyMenuItemSerializer(many=True, read_only=True)

    class Meta:
        model = menu_models.DailyMenu
        fields = ["id", "floor", "week_day", "daily_items"]

class DailyMenuItemCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = menu_models.DailyMenuItem
        fields = [
            "daily_menu",
            "floor_food",
            "is_available",
            "remaining_quantity",
            "special_price_override_cents",
            "special_name_override",
        ]

from rest_framework import serializers
from . import models as menu_models

class SpecialFoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = menu_models.SpecialFood
        fields = [
            "id",
            "vendor_branch",
            "floor",
            "name",
            "description",
            "price_cents",
            "category",
            "available_from",
            "available_to",
            "is_available",
        ]
        # Keep read_only if you want them not editable by default
        read_only_fields = []

    def validate(self, data):
        available_from = data.get("available_from")
        available_to = data.get("available_to")
        if available_from and available_to and available_to <= available_from:
            raise serializers.ValidationError(
                {"available_to": "available_to must be after available_from"}
            )
        if not data.get("name"):
            raise serializers.ValidationError({"name": "Name is required"})
        if data.get("price_cents", 0) < 0:
            raise serializers.ValidationError({"price_cents": "Price must be >= 0"})

        category = data.get("category")
        if category and category not in ["veg", "non_veg"]:
            raise serializers.ValidationError(
                {"category": "Category must be 'veg' or 'non_veg'"}
            )
        return data

# EMP order page;
class DailyMenuItemEmployeeSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    price_cents = serializers.SerializerMethodField()
    food_type = serializers.CharField(source="floor_food.vendor_branch_food.food.type")
    category = serializers.CharField(source="floor_food.vendor_branch_food.food.category")

    class Meta:
        model = menu_models.DailyMenuItem
        fields = [
            "id",
            "name",
            "description",
            "price_cents",
            "food_type",
            "category",
            "remaining_quantity",
            "is_available",
        ]

    def get_name(self, obj):
        return obj.special_name_override

    def get_description(self, obj):
        return obj.floor_food.description_override

    def get_price_cents(self, obj):
        return (
            obj.special_price_override_cents
        )