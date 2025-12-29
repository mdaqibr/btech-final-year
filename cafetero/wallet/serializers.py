# wallet/serializers.py
from rest_framework import serializers
from .models import EmployeeWallet, WalletTransaction

class EmployeeWalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeWallet
        fields = "__all__"

class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = "__all__"