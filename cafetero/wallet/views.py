# wallet/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import EmployeeWallet, WalletTransaction
from accounts.models import Employee
from common.permissions import IsCompanyAdmin, IsEmployee
from .serializers import EmployeeWalletSerializer, WalletTransactionSerializer
from django.db import transaction

class WalletTopUpView(APIView):
    # Company Admin tops up employee wallet (company-funded)
    permission_classes = [IsCompanyAdmin]
    def post(self, request):
        employee_id = request.data.get("employee_id")
        amount_cents = int(request.data.get("amount_cents", 0))
        if not employee_id or amount_cents <= 0:
            return Response({"detail":"invalid"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            emp = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            return Response({"detail":"employee not found"}, status=status.HTTP_404_NOT_FOUND)
        wallet, _ = EmployeeWallet.objects.get_or_create(employee=emp)
        with transaction.atomic():
            wallet.monthly_used_cents = max(0, wallet.monthly_used_cents - 0)  # placeholder
            # credit is represented by lowering used? Simpler: log credit
            WalletTransaction.objects.create(employee=emp, order_id=None, amount_cents=amount_cents, type="Credit", source="CompanyAdjustment")
            wallet.updated_at = timezone.now()
            wallet.save()
        return Response({"detail":"credited"}, status=status.HTTP_200_OK)

class EmployeeWalletView(APIView):
    permission_classes = [IsEmployee]
    def get(self, request):
        try:
            emp = Employee.objects.get(user=request.user)
        except Employee.DoesNotExist:
            return Response({"detail":"employee not found"}, status=status.HTTP_404_NOT_FOUND)
        wallet, _ = EmployeeWallet.objects.get_or_create(employee=emp)
        return Response(EmployeeWalletSerializer(wallet).data)
