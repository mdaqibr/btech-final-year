# wallet/models.py
from django.db import models
from accounts.models import Employee
from django.utils import timezone

class EmployeeWallet(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, primary_key=True)
    daily_limit_cents = models.IntegerField(default=0)
    monthly_limit_cents = models.IntegerField(default=0)
    daily_used_cents = models.IntegerField(default=0)
    monthly_used_cents = models.IntegerField(default=0)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "wallet_employee_wallet"

class WalletTransaction(models.Model):
    TYPE_CHOICES = [("Debit","Debit"), ("Credit","Credit")]
    SOURCE_CHOICES = [("Order","Order"), ("CompanyAdjustment","CompanyAdjustment"), ("Refund","Refund")]

    id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    order_id = models.IntegerField(null=True, blank=True)
    amount_cents = models.IntegerField()
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    source = models.CharField(max_length=32, choices=SOURCE_CHOICES)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "wallet_transactions"