from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 1
    autocomplete_fields = ['daily_menu_item']
    readonly_fields = ['id']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'created_at', 'total_items']
    list_select_related = ['user']
    search_fields = ['user__email', 'user__username']
    list_filter = ['created_at']
    ordering = ['-created_at']
    inlines = [CartItemInline]

    def total_items(self, obj):
        return obj.items.count()

    total_items.short_description = "Total Items"


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'cart', 'daily_menu_item', 'quantity']
    list_select_related = ['cart', 'daily_menu_item']
    search_fields = ['cart__user__email', 'daily_menu_item__name']
    list_filter = ['daily_menu_item']
    ordering = ['-id']
