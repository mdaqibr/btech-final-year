# wallet/urls.py
from django.urls import path
from .views import WalletTopUpView, EmployeeWalletView

urlpatterns = [
    path("topup/", WalletTopUpView.as_view()),
    path("me/", EmployeeWalletView.as_view()),
]
