from django.urls import path
from .views import LoginView, LogoutView, ProfileView, RegisterCompanyView, RegisterVendorView, RegisterEmployeeView, RefreshTokenAPI

urlpatterns = [
    path("login/", LoginView.as_view()),
    path("refresh/", RefreshTokenAPI.as_view()),
    path("logout/", LogoutView.as_view()),
    path("me/", ProfileView.as_view()),

    path("register/company/", RegisterCompanyView.as_view()),
    path("register/vendor/", RegisterVendorView.as_view()),
    path("register/employee/", RegisterEmployeeView.as_view()),
]
