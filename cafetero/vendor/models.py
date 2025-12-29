# vendor/models.py
from django.db import models
from django.utils import timezone
from accounts import models as account_models
from common import models as common_models
from django.conf import settings

STATUS_CHOICES = [("pending","pending"), ("approved","approved"), ("rejected","rejected"), ("removed","removed")]

class VendorWorker(common_models.BaseModel):
    ROLE_CHOICES = [("Manager", "Manager"), ("Worker", "Worker"), ("Delivery", "Delivery")]
    vendor_branch = models.ForeignKey(account_models.VendorBranch, on_delete=models.CASCADE)
    company_floor = models.ForeignKey(account_models.CompanyFloor, on_delete=models.CASCADE)
    user = models.ForeignKey(account_models.User, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=32, null=True, blank=True)
    role = models.CharField(max_length=32, choices=ROLE_CHOICES)
    pin_code = models.CharField(max_length=8, null=True, blank=True)
    login_id = models.CharField(max_length=6, unique=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "vendor_worker"
        indexes = [models.Index(fields=["vendor_branch", "is_active"])]

    def __str__(self):
        return f"{self.name}"


class CompanyVendor(common_models.BaseModel):
    company = models.ForeignKey(account_models.Company, on_delete=models.CASCADE, related_name="company_vendors")
    vendor = models.ForeignKey(account_models.Vendor, on_delete=models.CASCADE, related_name="vendor_companies")

    class Meta:
        db_table = "company_vendor"
        unique_together = ("company", "vendor")
        indexes = [models.Index(fields=["company", "vendor"])]

    def __str__(self):
        return f"C:{self.company.name}-V:{self.vendor.name}"


class CompanyVendorBranch(models.Model):
    company_vendor = models.ForeignKey(CompanyVendor, on_delete=models.CASCADE, related_name="branches")
    vendor_branch = models.ForeignKey(account_models.VendorBranch, on_delete=models.CASCADE)
    floor = models.ForeignKey(account_models.CompanyFloor, on_delete=models.CASCADE)
    service_opening_time = models.TimeField(null=True, blank=True)
    service_closing_time = models.TimeField(null=True, blank=True)
    lunch_start_time = models.TimeField(null=True, blank=True)
    lunch_end_time = models.TimeField(null=True, blank=True)
    special_meal = models.TextField(null=True, blank=True)   # resets daily
    vendor_acceptance_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    rejection_reason = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, default="active")

    class Meta:
        db_table = "company_vendor_branch"
        indexes = [models.Index(fields=["company_vendor", "vendor_branch", "floor"])]

    def __str__(self):
        return f"C:{self.company_vendor.company.name}-V:{self.vendor_branch.branch_name}-F:{self.floor.floor_name}"


class VendorOnboardingAction(models.Model):
    ACTION_CHOICES = [("request","request"),("approve","approve"),("reject","reject"),("remove","remove")]
    company_vendor = models.ForeignKey(CompanyVendor, on_delete=models.CASCADE, related_name="actions")
    action_type = models.CharField(max_length=20, choices=ACTION_CHOICES)
    performed_by_user = models.ForeignKey(account_models.User, on_delete=models.SET_NULL, null=True, blank=True)
    reason = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "vendor_onboarding_action"
        indexes = [models.Index(fields=["company_vendor", "action_type"])]


    def __str__(self):
        return f"C:{self.company_vendor.company.name}-V:{self.company_vendor.vendor.name}"


class VendorFeedback(models.Model):
    vendor_branch = models.ForeignKey(account_models.VendorBranch, on_delete=models.CASCADE, related_name="feedbacks")
    employee = models.ForeignKey(account_models.Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name="vendor_feedbacks")
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "vendor_feedback"
        indexes = [models.Index(fields=["vendor_branch", "rating"])]
