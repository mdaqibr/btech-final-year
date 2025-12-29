# service/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone

from accounts.models import Company, CompanyBranch, CompanyBuilding, Vendor, VendorBranch

class VendorService(models.Model):
    STATUS_PENDING = "Pending"
    STATUS_ACCEPTED = "Accepted"
    STATUS_REJECTED = "Rejected"
    STATUS_DISABLED = "Disabled"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_ACCEPTED, "Accepted"),
        (STATUS_REJECTED, "Rejected"),
        (STATUS_DISABLED, "Disabled"),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    branch = models.ForeignKey(CompanyBranch, on_delete=models.CASCADE)
    building = models.ForeignKey(CompanyBuilding, on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    vendor_branch = models.ForeignKey(VendorBranch, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    rejected_reason = models.TextField(null=True, blank=True)
    requested_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="vendorservice_requested")
    responded_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="vendorservice_responded")
    created_at = models.DateTimeField(default=timezone.now)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "service_vendor_service"
        indexes = [
            models.Index(fields=["company", "vendor"]),
            models.Index(fields=["vendor", "vendor_branch"]),
        ]

    def __str__(self):
        return f"{self.company.name} - {self.vendor.name} ({self.status})"