from django.db import models
from common import models as common_models
from django.utils import timezone
from accounts.models import Vendor, VendorBranch, CompanyFloor

class FoodItem(common_models.BaseModel):
    FOOD_TYPE = [
        ("breakfast","Breakfast"),
        ("lunch","Lunch"),
        ("evening_snacks","Evening Snacks"),
        ("dinner","Dinner"),
    ]

    FOOD_CATEGORY = [
        ("veg","Veg"),
        ("non_veg","Non Veg"),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="vendor_foods")
    type = models.CharField(max_length=50, choices=FOOD_TYPE)
    category = models.CharField(max_length=50, choices=FOOD_CATEGORY)
    base_price_cents = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "menu_food_item"
        unique_together = ("vendor", "name")
        indexes = [models.Index(fields=["vendor", "name"])]

    def __str__(self):
        return f"{self.name} ({self.vendor.name})"

class VendorBranchFood(common_models.BaseModel):
    vendor_branch = models.ForeignKey(VendorBranch, on_delete=models.CASCADE, related_name="branch_foods")
    food = models.ForeignKey(FoodItem, on_delete=models.CASCADE, related_name="branch_activations")
    branch_level_price_override_cents = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        db_table = "menu_vendor_branch_food"
        unique_together = ("vendor_branch", "food")
        indexes = [models.Index(fields=["vendor_branch", "food"])]

class FloorFood(common_models.BaseModel):
    floor = models.ForeignKey(CompanyFloor, on_delete=models.CASCADE, related_name="floor_foods")
    vendor_branch_food = models.ForeignKey(VendorBranchFood, on_delete=models.CASCADE, related_name="floor_maps")
    floor_level_price_override_cents = models.PositiveIntegerField(null=True, blank=True)
    name_override = models.CharField(max_length=255, null=True, blank=True)
    description_override = models.TextField(null=True, blank=True)
    default_quantity = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        db_table = "menu_floor_food"
        unique_together = ("floor", "vendor_branch_food")
        indexes = [models.Index(fields=["floor", "vendor_branch_food"])]

class DailyMenu(models.Model):
    WEEK_DAY = [
        ("monday","Monday"),
        ("tuesday","Tuesday"),
        ("wednesday","Wednesday"),
        ("thursday","Thursday"),
        ("friday","Friday"),
        ("saturday","Saturday"),
        ("sunday","Sunday"),
    ]

    floor = models.ForeignKey(CompanyFloor, on_delete=models.CASCADE, related_name="daily_menus")
    week_day = models.CharField(max_length=10, choices=WEEK_DAY)

    class Meta:
        db_table = "menu_daily_menu"
        unique_together = ("floor", "week_day")
        indexes = [models.Index(fields=["floor", "week_day"])]

class DailyMenuItem(models.Model):
    daily_menu = models.ForeignKey(DailyMenu, on_delete=models.CASCADE, related_name="daily_items")
    floor_food = models.ForeignKey(FloorFood, on_delete=models.CASCADE, related_name="daily_menu_items")
    is_available = models.BooleanField(default=True)
    remaining_quantity = models.PositiveIntegerField(null=True, blank=True)
    special_price_override_cents = models.PositiveIntegerField(null=True, blank=True)
    special_name_override = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "menu_daily_menu_item"
        unique_together = ("daily_menu", "floor_food")
        indexes = [models.Index(fields=["daily_menu", "floor_food"])]

class SpecialFood(models.Model):
    vendor_branch = models.ForeignKey(VendorBranch, on_delete=models.CASCADE, related_name="special_foods")
    floor = models.ForeignKey(CompanyFloor, on_delete=models.CASCADE, related_name="special_foods")
    available_from = models.DateTimeField()
    available_to = models.DateTimeField()
    is_available = models.BooleanField(default=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    price_cents = models.PositiveIntegerField(default=0)
    category = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = "menu_special_food"
        indexes = [models.Index(fields=["vendor_branch", "floor", "available_from"])]

class FoodRating(models.Model):
    order_item_id = models.IntegerField(db_index=True)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "menu_food_rating"
