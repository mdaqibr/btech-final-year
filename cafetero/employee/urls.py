# employee/urls.py
from django.urls import path
from employee import views

urlpatterns = [
    path("dashboard/", views.EmployeeDashboardAPIView.as_view()),
    path("buildings/<int:building_id>/floors/", views.BuildingFloorsAPIView.as_view()),
    path("floors/<int:floor_id>/vendors/", views.FloorVendorsAPIView.as_view()),
]