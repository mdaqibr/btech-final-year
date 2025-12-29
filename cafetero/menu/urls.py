# menu/urls.py
from django.urls import path
from menu import views

urlpatterns = [
    path("vendor/foods/", views.VendorFoodListCreateAPIView.as_view()),
    path("vendor/foods/<int:pk>/", views.VendorFoodRetrieveUpdateDestroyAPIView.as_view()),
    path(
        "vendor-branch-foods/<int:branch_id>/",
        views.VendorBranchFoodListCreateAPIView.as_view(),
    ),
    path(
        "vendor-branch-food/<int:pk>/",
        views.VendorBranchFoodRetrieveUpdateDestroyAPIView.as_view(),
    ),
    path("floor-foods/<int:floor_id>/", views.FloorFoodListCreateAPIView.as_view()),
    path("floor-food/<int:pk>/", views.FloorFoodRetrieveUpdateDestroyAPIView.as_view()),
    
    path(
        "vendor/branches/<int:branch_id>/foods/",
        views.VendorBranchFoodListAPIView.as_view(),
        name="vendor-branch-food-list",
    ),
]