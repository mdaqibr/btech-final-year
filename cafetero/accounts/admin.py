from django.contrib import admin
from django import forms
from django.contrib.auth.hashers import make_password

from accounts.models import (
    User,
    UserType,
    Company,
    CompanyBranch,
    CompanyBuilding,
    CompanyFloor,
    Vendor,
    VendorBranch,
    Employee,
    EmailOTP,
)


# ==========================
# User Admin
# ==========================
class UserAdminForm(forms.ModelForm):
    class Meta:
        model = User
        fields = "__all__"

    def clean_password(self):
        password = self.cleaned_data.get("password")
        user = getattr(self, "instance", None)

        # Keep existing hashed password
        if user and user.pk and user.password.startswith("pbkdf2_"):
            return user.password

        # Hash new password
        return make_password(password)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    form = UserAdminForm
    list_display = ("email", "user_type", "is_active", "created_at")
    list_filter = ("user_type", "is_active", "created_at")
    search_fields = ("email",)
    ordering = ("-created_at",)


# ==========================
# User Type
# ==========================
@admin.register(UserType)
class UserTypeAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


# ==========================
# Company
# ==========================
@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("name", "domain", "location", "is_active", "created_at")
    list_filter = ("is_active", "created_at")
    search_fields = ("name", "domain")
    raw_id_fields = ("user",)


# ==========================
# Company Branch
# ==========================
@admin.register(CompanyBranch)
class CompanyBranchAdmin(admin.ModelAdmin):
    list_display = ("branch_name", "company", "city", "state", "is_active")
    list_filter = ("company", "city", "state", "is_active")
    search_fields = ("branch_name", "city")
    raw_id_fields = ("company",)


# ==========================
# Company Building
# ==========================
@admin.register(CompanyBuilding)
class CompanyBuildingAdmin(admin.ModelAdmin):
    list_display = ("building_name", "branch", "floor_count", "created_at")
    list_filter = ("branch",)
    search_fields = ("building_name",)
    raw_id_fields = ("branch",)


# ==========================
# Company Floor (NEW)
# ==========================
@admin.register(CompanyFloor)
class CompanyFloorAdmin(admin.ModelAdmin):
    list_display = ("floor_name", "floor_number", "building", "created_at")
    list_filter = ("building",)
    search_fields = ("floor_name",)
    raw_id_fields = ("building",)
    ordering = ("floor_number",)


# ==========================
# Vendor
# ==========================
@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name",)
    raw_id_fields = ("user",)


# ==========================
# Vendor Branch
# ==========================
@admin.register(VendorBranch)
class VendorBranchAdmin(admin.ModelAdmin):
    list_display = ("branch_name", "vendor", "city", "state", "is_active")
    list_filter = ("vendor", "city", "state", "is_active")
    search_fields = ("branch_name", "city")
    raw_id_fields = ("vendor",)


# ==========================
# Employee
# ==========================
@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "employee_code",
        "company",
        "branch",
        "building",
        "is_active",
    )
    list_filter = ("company", "branch", "is_active")
    search_fields = ("full_name", "employee_code")
    raw_id_fields = ("user", "company", "branch", "building")


# ==========================
# Email OTP (NEW)
# ==========================
@admin.register(EmailOTP)
class EmailOTPAdmin(admin.ModelAdmin):
    list_display = ("email", "otp", "is_used", "expires_at", "created_at")
    list_filter = ("is_used", "expires_at")
    search_fields = ("email",)
    readonly_fields = ("otp", "created_at")
