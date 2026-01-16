# worker/views.py
from django.urls import path
from worker import views
urlpatterns = [
    path("login/", views.WorkerLoginView.as_view()),
    path("token/refresh/", views.WorkerTokenRefreshView.as_view()),
    path("today-orders/", views.TodayConfirmedOrdersView.as_view()),
    path("update-status/<int:pk>/", views.WorkerUpdateOrderStatusView.as_view()),
]
