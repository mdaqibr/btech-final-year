# order/serializers.py
from rest_framework import serializers
from order import models as order_models


class CartItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        source="daily_menu_item.floor_food.vendor_branch_food.food.name"
    )
    price = serializers.IntegerField(
        source="daily_menu_item.special_price_override_cents"
    )

    is_available = serializers.BooleanField(
        source="daily_menu_item.is_available",
        read_only=True
    )

    class Meta:
        model = order_models.CartItem
        fields = [
            "id",
            "daily_menu_item",
            "name",
            "price",
            "quantity",
            "is_available",
        ]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)

    class Meta:
        model = order_models.Cart
        fields = ["id", "items"]


class OrderFeedbackSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = order_models.OrderFeedback
        fields = ["rating", "comment", "created_at", "user"]

class OrderItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="daily_menu_item.floor_food.food.name")

    class Meta:
        model = order_models.OrderItem
        fields = ["name", "price_cents", "quantity"]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    feedback = OrderFeedbackSerializer(read_only=True)

    class Meta:
        model = order_models.Order
        fields = [
            "id",
            "status",
            "total_amount_cents",
            "created_at",
            "items",
            "feedback",
        ]

class TodayFeedbackSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    order_time = serializers.DateTimeField(source="order.created_at")

    class Meta:
        model = order_models.OrderFeedback
        fields = ["rating", "comment", "user", "order_time"]

class FoodFeedbackSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.email")
    order_time = serializers.DateTimeField(source="created_at")

    class Meta:
        model = order_models.OrderFeedback
        fields = [
            "user",
            "rating",
            "comment",
            "order_time"
        ]