from django.contrib import admin
from django import forms
from .models import User, UserType, Company, CompanyBranch, CompanyBuilding, Vendor, VendorBranch, Employee
from django.contrib.auth.hashers import make_password

class UserAdminForm(forms.ModelForm):
    class Meta:
        model = User
        fields = "__all__"

    def clean_password(self):
        password = self.cleaned_data.get("password")
        user = getattr(self, "instance", None)

        # If password already hashed, keep it
        if user and user.pk:
            if user.password.startswith("pbkdf2_"):
                return user.password

        # Otherwise hash new password
        return make_password(password)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    form = UserAdminForm
    list_display = ["email", "user_type", "is_active", "created_at"]
    search_fields = ["email"]
    list_filter = ["user_type", "is_active"]

@admin.register(UserType)
class UserTypeAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("name", "domain", "location", "is_active", "created_at")
    list_filter = ("is_active", "created_at")
    search_fields = ("name", "domain")

@admin.register(CompanyBranch)
class CompanyBranchAdmin(admin.ModelAdmin):
    list_display = ("company", "branch_name", "city", "state", "is_active")
    list_filter = ("company", "is_active", "city")
    search_fields = ("branch_name",)

@admin.register(CompanyBuilding)
class CompanyBuildingAdmin(admin.ModelAdmin):
    list_display = ("branch", "building_name", "floor_count", "created_at")
    list_filter = ("branch",)
    search_fields = ("building_name",)

@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name",)

@admin.register(VendorBranch)
class VendorBranchAdmin(admin.ModelAdmin):
    list_display = ("vendor", "branch_name", "city", "is_active")
    list_filter = ("vendor", "is_active")
    search_fields = ("branch_name",)

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ("full_name", "company", "branch", "building", "is_active")
    list_filter = ("company", "branch", "is_active")
    search_fields = ("full_name", "employee_code")
