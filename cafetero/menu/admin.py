from django.contrib import admin
from .models import (
    FoodItem,
    VendorBranchFood,
    FloorFood,
    DailyMenu,
    DailyMenuItem,
    SpecialFood,
    FoodRating,
)

# ---------------- FOOD ITEM ----------------

@admin.register(FoodItem)
class FoodItemAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "vendor", "type", "category", "base_price_cents")
    search_fields = ("name", "vendor__name")
    list_filter = ("type", "category", "vendor")
    autocomplete_fields = ("vendor",)
    ordering = ("vendor", "name")


# ---------------- VENDOR BRANCH FOOD ----------------

@admin.register(VendorBranchFood)
class VendorBranchFoodAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "vendor_branch",
        "food",
        "branch_level_price_override_cents",
    )
    search_fields = ("food__name", "vendor_branch__name")
    list_filter = ("vendor_branch",)
    autocomplete_fields = ("vendor_branch", "food")


# ---------------- FLOOR FOOD ----------------

@admin.register(FloorFood)
class FloorFoodAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "floor",
        "vendor_branch_food",
        "floor_level_price_override_cents",
        "default_quantity",
    )
    search_fields = (
        "vendor_branch_food__food__name",
        "floor__name",
    )
    list_filter = ("floor",)
    autocomplete_fields = ("floor", "vendor_branch_food")


# ---------------- DAILY MENU ITEM INLINE ----------------

class DailyMenuItemInline(admin.TabularInline):
    model = DailyMenuItem
    extra = 1
    autocomplete_fields = ("floor_food",)


# ---------------- DAILY MENU ----------------

@admin.register(DailyMenu)
class DailyMenuAdmin(admin.ModelAdmin):
    list_display = ("id", "floor", "week_day")
    list_filter = ("week_day", "floor")
    search_fields = ("floor__name",)
    autocomplete_fields = ("floor",)
    inlines = [DailyMenuItemInline]


# ---------------- DAILY MENU ITEM ----------------

@admin.register(DailyMenuItem)
class DailyMenuItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "daily_menu",
        "floor_food",
        "is_available",
        "remaining_quantity",
        "special_price_override_cents",
    )
    list_filter = ("is_available", "daily_menu__week_day")
    search_fields = ("floor_food__vendor_branch_food__food__name",)
    autocomplete_fields = ("daily_menu", "floor_food")


# ---------------- SPECIAL FOOD ----------------

@admin.register(SpecialFood)
class SpecialFoodAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "vendor_branch",
        "floor",
        "price_cents",
        "available_from",
        "available_to",
        "is_available",
    )
    list_filter = ("vendor_branch", "floor", "is_available")
    search_fields = ("name", "vendor_branch__name", "floor__name")
    autocomplete_fields = ("vendor_branch", "floor")


# ---------------- FOOD RATING ----------------

@admin.register(FoodRating)
class FoodRatingAdmin(admin.ModelAdmin):
    list_display = ("id", "order_item_id", "rating", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = ("order_item_id", "comment")
    readonly_fields = ("created_at",)
