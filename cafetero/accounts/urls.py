from django.urls import path
from accounts import views

urlpatterns = [
    path("login/", views.LoginView.as_view()),
    path("refresh/", views.RefreshTokenAPI.as_view()),
    path("logout/", views.LogoutView.as_view()),
    path("me/", views.ProfileView.as_view()),

    path("company/register/create-user/", views.RegisterCompanyUser.as_view()),
    path("company/register/set-password/", views.SetPassword.as_view()),
    path("company/register/send-otp/", views.SendOTP.as_view()),
    path("company/register/verify-otp/", views.VerifyOTP.as_view()),
    path("company/register/update-company/", views.UpdateCompanyInfo.as_view()),
    path("company/register/add-branches/", views.AddBranchesAndBuildings.as_view()),
]
