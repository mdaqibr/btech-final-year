from django.db import models
from common.models import BaseModel
from django.utils import timezone


class UserType(BaseModel):
    name = models.CharField(max_length=100, unique=True)  # SuperAdmin, Company, Vendor, Employee

    class Meta:
        db_table = "user_type"

    def __str__(self):
        return self.name

class User(BaseModel):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    user_type = models.ForeignKey(UserType, on_delete=models.CASCADE)
    last_login = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "app_user"
        indexes = [
            models.Index(fields=['email']),
        ]

    def __str__(self):
        return self.email

class Company(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, unique=True)
    domain = models.CharField(max_length=255, unique=True)
    logo = models.ImageField(upload_to="company_logos/", null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    location = models.CharField(max_length=200)

    class Meta:
        db_table = "company"
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['domain']),
        ]


class CompanyBranch(BaseModel):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    branch_name = models.CharField(max_length=255)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=50, default="IN")

    class Meta:
        db_table = "company_branch"
        indexes = [
            models.Index(fields=['company']),
            models.Index(fields=['city']),
            models.Index(fields=['state']),
        ]

class CompanyBuilding(BaseModel):
    branch = models.ForeignKey(CompanyBranch, on_delete=models.CASCADE)
    building_name = models.CharField(max_length=255)
    floor_count = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = "company_building"
        indexes = [
            models.Index(fields=['branch']),
        ]

class Vendor(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, unique=True)
    logo = models.ImageField(upload_to="vendor_logos/", null=True, blank=True)

    class Meta:
        db_table = "vendor"

        indexes = [
            models.Index(fields=['name']),
        ]

class VendorBranch(BaseModel):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    branch_name = models.CharField(max_length=255)
    state = models.CharField(max_length=100, default="Haryana")
    country = models.CharField(max_length=50, default="IN")
    city = models.CharField(max_length=100)
    address = models.TextField()

    class Meta:
        db_table = "vendor_branch"
        indexes = [
            models.Index(fields=['vendor']),
            models.Index(fields=['city']),
            models.Index(fields=['state']),
        ]

class Employee(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    branch = models.ForeignKey(CompanyBranch, on_delete=models.CASCADE)
    building = models.ForeignKey(CompanyBuilding, on_delete=models.SET_NULL, null=True)
    full_name = models.CharField(max_length=255)
    employee_code = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = "employee"

        indexes = [
            models.Index(fields=['full_name']),
            models.Index(fields=['employee_code']),
            models.Index(fields=['company']),
        ]


class EmailOTP(BaseModel):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    expires_at = models.DateTimeField()
    attempts = models.IntegerField(default=0)
    is_used = models.BooleanField(default=False)

    class Meta:
        db_table = "email_otp"
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['is_used']),
        ]

    def is_expired(self):
        return timezone.now() > self.expires_at