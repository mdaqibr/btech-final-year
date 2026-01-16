from rest_framework import serializers
from order import models as order_models
class CartItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="daily_menu_item.floor_food.vendor_branch_food.food.name")
    price = serializers.IntegerField(source="daily_menu_item.special_price_override_cents")

    class Meta:
        model = order_models.CartItem
        fields = ["id", "daily_menu_item", "name", "price", "quantity"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)

    class Meta:
        model = order_models.Cart
        fields = ["id", "items"]