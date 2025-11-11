from django.db import models
from common.models import BaseModel


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

    def __str__(self):
        return self.email

class Company(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    domain = models.CharField(max_length=255)
    logo = models.ImageField(upload_to="company_logos/", null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    location = models.CharField(max_length=200)

    class Meta:
        db_table = "company"


class CompanyBranch(BaseModel):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    branch_name = models.CharField(max_length=255)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)

    class Meta:
        db_table = "company_branch"


class CompanyBuilding(BaseModel):
    branch = models.ForeignKey(CompanyBranch, on_delete=models.CASCADE)
    building_name = models.CharField(max_length=255)
    floor_count = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = "company_building"


class Vendor(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to="vendor_logos/", null=True, blank=True)

    class Meta:
        db_table = "vendor"


class VendorBranch(BaseModel):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    branch_name = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    address = models.TextField()

    class Meta:
        db_table = "vendor_branch"


class Employee(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    branch = models.ForeignKey(CompanyBranch, on_delete=models.CASCADE)
    building = models.ForeignKey(CompanyBuilding, on_delete=models.SET_NULL, null=True)
    full_name = models.CharField(max_length=255)
    employee_code = models.CharField(max_length=100)

    class Meta:
        db_table = "employee"
