from django.urls import path
from accounts import views

urlpatterns = [
    path("login/", views.LoginView.as_view()),

    path("company/register/create-user/", views.RegisterCompanyUser.as_view()),
    path("company/register/set-password/", views.SetPassword.as_view()),
    path("company/register/send-otp/", views.SendOTP.as_view()),
    path("company/register/verify-otp/", views.VerifyOTP.as_view()),
    path("company/register/update-company/", views.UpdateCompanyInfo.as_view()),
    path("company/register/add-branches/", views.AddBranchesAndBuildings.as_view()),

    # VENDOR
    path("vendor/register/create-user/", views.RegisterVendorUser.as_view()),
    path("vendor/register/set-password/", views.VendorSetPassword.as_view()),
    path("vendor/register/send-otp/", views.VendorSendOTP.as_view()),
    path("vendor/register/verify-otp/", views.VendorVerifyOTP.as_view()),
    path("vendor/register/update-vendor/", views.UpdateVendorInfo.as_view()),
    path("vendor/register/add-branches/", views.AddVendorBranches.as_view()),

    # EMPLOYEE
    path("employee/register/create-user/", views.RegisterEmployeeUser.as_view()),
    path("employee/register/set-password/", views.EmployeeSetPassword.as_view()),
    path("employee/register/send-otp/", views.EmployeeSendOTP.as_view()),
    path("employee/register/verify-otp/", views.EmployeeVerifyOTP.as_view()),
    path("employee/register/update-employee/", views.UpdateEmployeeInfo.as_view()),

    # Dropdown lists
    path("companies/", views.GetCompanies.as_view()),
    path("companies/<int:company_id>/branches/", views.GetBranches.as_view()),
    path("branches/<int:branch_id>/buildings/", views.GetBuildings.as_view()),
]
