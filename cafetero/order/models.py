# order/models.py
from django.conf import settings
from django.db import models
from accounts import models as account_models
from menu import models as menu_models

class Cart(models.Model):
    user = models.OneToOneField(account_models.User, on_delete=models.CASCADE, related_name="cart")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} Cart"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    daily_menu_item = models.ForeignKey(menu_models.DailyMenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ("cart", "daily_menu_item")

class Order(models.Model):
    STATUS = [
        ("PAYMENT_PENDING","Payment Pending"),
        ("CONFIRMED","Confirmed"),
        ("PREPARING","Preparing"),
        ("READY","Ready"),
        ("COMPLETED","Completed"),
        ("FAILED","Failed"),
        ("CANCELLED","Cancelled"),
    ]

    user = models.ForeignKey(account_models.User,on_delete=models.CASCADE)
    total_amount_cents = models.PositiveIntegerField()
    status = models.CharField(max_length=20,choices=STATUS,default="PAYMENT_PENDING")
    razorpay_order_id = models.CharField(max_length=255,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE,related_name="items")
    daily_menu_item = models.ForeignKey(menu_models.DailyMenuItem,on_delete=models.PROTECT)
    price_cents = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField()

class PaymentLog(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE)
    payload = models.JSONField()
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

class OrderFeedback(models.Model):
    order = models.OneToOneField(
        Order, on_delete=models.CASCADE, related_name="feedback"
    )
    user = models.ForeignKey(
        account_models.User, on_delete=models.CASCADE
    )

    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=models.Q(rating__gte=1, rating__lte=5),
                name="rating_between_1_and_5"
            )
        ]

    def __str__(self):
        return f"Order {self.order.id} - {self.rating}★"