# order/urls.py
from django.urls import path
from order import views

urlpatterns = [
  path("cart/add/", views.AddToCartView.as_view()),
  path("cart/", views.GetCartView.as_view()),
  path("cart/remove/", views.RemoveFromCartView.as_view()),
  path("cart/update/", views.UpdateCartQtyView.as_view()),
  
  path("create/", views.CreateOrderView.as_view()),
  path("verify/", views.VerifyPaymentView.as_view()),
  path("payment-webhook/", views.PaymentWebhookView.as_view()),
  path("my-orders/", views.MyOrdersView.as_view()),
]