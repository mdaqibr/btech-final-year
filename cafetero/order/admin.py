# order/admin.py
from django.contrib import admin
from .models import (
    Cart,
    CartItem,
    Order,
    OrderItem,
    PaymentLog,
    OrderFeedback,
)


# --------------------
# Cart & Cart Items
# --------------------

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    autocomplete_fields = ("daily_menu_item",)


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at")
    search_fields = ("user__email", "user__username")
    inlines = [CartItemInline]
    readonly_fields = ("created_at",)


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("id", "cart", "daily_menu_item", "quantity")
    search_fields = (
        "cart__user__email",
        "daily_menu_item__floor_food__vendor_branch_food__food__name",
    )
    list_filter = ("daily_menu_item",)


# --------------------
# Orders & Order Items
# --------------------

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    autocomplete_fields = ("daily_menu_item",)
    readonly_fields = ("price_cents",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "total_amount_cents",
        "status",
        "razorpay_order_id",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = (
        "id",
        "user__email",
        "razorpay_order_id",
    )
    readonly_fields = ("created_at",)
    inlines = [OrderItemInline]
    ordering = ("-created_at",)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
        "daily_menu_item",
        "price_cents",
        "quantity",
    )
    search_fields = (
        "order__id",
        "daily_menu_item__floor_food__vendor_branch_food__food__name",
    )


# --------------------
# Payments
# --------------------

@admin.register(PaymentLog)
class PaymentLogAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("order__id",)
    readonly_fields = ("created_at", "payload")


# --------------------
# Order Feedback
# --------------------

@admin.register(OrderFeedback)
class OrderFeedbackAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "user", "rating", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = (
        "order__id",
        "user__email",
        "comment",
    )
    readonly_fields = ("created_at",)
