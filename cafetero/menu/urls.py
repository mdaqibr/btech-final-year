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

    # Daily Menu under floor.
    path("daily-menu/", views.DailyMenuView.as_view()),
    path("daily-menu-items/", views.DailyMenuItemCreateView.as_view()),
    path("daily-menu-items/<int:pk>/", views.DailyMenuItemUpdateView.as_view()),
    path("daily-menu-items/<int:pk>/delete/", views.DailyMenuItemDeleteView.as_view()),
    path("daily-menu-items/manage/", views.DailyMenuItemCreateUpdateView.as_view()),
    path("daily-menu-items/manage/<int:pk>/", views.DailyMenuItemCreateUpdateView.as_view()),
  
    # Special Food
    path("special-food/", views.SpecialFoodListCreateView.as_view()),
    path("special-food/<int:pk>/", views.SpecialFoodRetrieveUpdateDestroyView.as_view()),
    
    # EMP order;
    path("employee/today-menu/", views.EmployeeTodayMenuView.as_view()),
]