from django.contrib import admin
from .models import (
    VendorWorker,
    CompanyVendor,
    CompanyVendorBranch,
    VendorOnboardingAction,
    VendorFeedback,
)

# -----------------------------------
# Vendor Worker
# -----------------------------------
@admin.register(VendorWorker)
class VendorWorkerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "role",
        "vendor_branch",
        "phone",
        "is_active",
        "created_at",
    )
    list_filter = ("role", "vendor_branch", "is_active")
    search_fields = ("name", "phone", "vendor_branch__name")
    autocomplete_fields = ("vendor_branch", "user")
    ordering = ("-created_at",)


# -----------------------------------
# Inlines
# -----------------------------------
class CompanyVendorBranchInline(admin.TabularInline):
    model = CompanyVendorBranch
    extra = 0
    autocomplete_fields = ("vendor_branch", "floor")
    fields = (
        "vendor_branch",
        "floor",
        "service_opening_time",
        "service_closing_time",
        "lunch_start_time",
        "lunch_end_time",
        "special_meal",
        "status",
    )


class VendorOnboardingActionInline(admin.TabularInline):
    model = VendorOnboardingAction
    extra = 0
    readonly_fields = ("timestamp",)
    autocomplete_fields = ("performed_by_user",)
    fields = (
        "action_type",
        "performed_by_user",
        "reason",
        "timestamp",
    )


# -----------------------------------
# Company Vendor
# -----------------------------------
@admin.register(CompanyVendor)
class CompanyVendorAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "company",
        "vendor",
        "created_at",
    )
    list_filter = ("company", "vendor")
    search_fields = (
        "company__name",
        "vendor__name",
    )
    autocomplete_fields = ("company", "vendor")
    inlines = (
        CompanyVendorBranchInline,
        VendorOnboardingActionInline,
    )
    ordering = ("-created_at",)

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ("company", "vendor", "created_at", "updated_at")
        return ()


# -----------------------------------
# Company Vendor Branch (standalone)
# -----------------------------------
@admin.register(CompanyVendorBranch)
class CompanyVendorBranchAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "company_vendor",
        "vendor_branch",
        "floor",
        "vendor_acceptance_status",
        "status",
    )
    list_filter = ("status", "vendor_branch", "vendor_acceptance_status", "floor")
    search_fields = (
        "vendor_branch__name",
        "floor__name",
        "company_vendor__company__name",
        "company_vendor__vendor__name",
    )
    autocomplete_fields = (
        "company_vendor",
        "vendor_branch",
        "floor",
    )

# -----------------------------------
# Vendor Onboarding Action
# -----------------------------------
@admin.register(VendorOnboardingAction)
class VendorOnboardingActionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "company_vendor",
        "action_type",
        "performed_by_user",
        "timestamp",
    )
    list_filter = ("action_type",)
    search_fields = (
        "company_vendor__company__name",
        "company_vendor__vendor__name",
        "performed_by_user__email",
    )
    autocomplete_fields = (
        "company_vendor",
        "performed_by_user",
    )
    readonly_fields = ("timestamp",)
    ordering = ("-timestamp",)


# -----------------------------------
# Vendor Feedback
# -----------------------------------
@admin.register(VendorFeedback)
class VendorFeedbackAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "vendor_branch",
        "employee",
        "rating",
        "created_at",
    )
    list_filter = ("rating", "vendor_branch")
    search_fields = (
        "vendor_branch__name",
        "employee__user__email",
        "comment",
    )
    autocomplete_fields = ("vendor_branch", "employee")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)
