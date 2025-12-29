from rest_framework import serializers
from django.db import transaction
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from accounts.models import User, Company, CompanyBranch, CompanyBuilding, Vendor, VendorBranch, Employee, CompanyFloor
from vendor import models as vendor_models
from accounts.services.email.vendor_email import send_vendor_request_email
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data["email"]
        password = data["password"]

        try:
            user = User.objects.get(email=email)
            print("user: ", user.__dict__)

        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")

        if not user.is_active:
            raise serializers.ValidationError("User is inactive")
  
        print("check_password(password, user.password):", check_password(password, user.password))
        if not check_password(password, user.password):
            raise serializers.ValidationError("Invalid email or password")

        data["user"] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    user_type = serializers.CharField(source="user_type.name")

    class Meta:
        model = User
        fields = ("id", "email", "user_type", "is_active", "last_login", "created_at")

class CreateUserSerializer(serializers.Serializer):
    email = serializers.EmailField()

class SetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

class CompanyInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ["name", "domain", "bio", "location", "logo"]


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyBranch
        fields = ["branch_name", "address", "city", "state"]


class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyBuilding
        fields = ["branch", "building_name", "floor_count"]

class VendorInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ["name", "logo"]


class VendorBranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorBranch
        fields = ["branch_name", "city", "state", "address"]

class EmployeeInfoSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(),
        required=True,
        allow_null=False
    )
    branch = serializers.PrimaryKeyRelatedField(
        queryset=CompanyBranch.objects.all(),
        required=True,
        allow_null=False
    )
    building = serializers.PrimaryKeyRelatedField(
        queryset=CompanyBuilding.objects.all(),
        required=True,
        allow_null=False
    )

    class Meta:
        model = Employee
        fields = [
            "full_name",
            "company",
            "branch",
            "building",
            "employee_code",
        ]

class CompanyBranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyBranch
        fields = ["id", "branch_name", "address", "city", "state", "country"]

class CompanyBuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyBuilding
        fields = ["id", "building_name", "floor_count"]

class CompanyFloorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyFloor
        fields = [
            "id",
            "building",
            "floor_name",
            "floor_number",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

class FloorVendorSerializer(serializers.ModelSerializer):
    vendor_id = serializers.IntegerField(source="company_vendor.vendor.id")
    vendor_name = serializers.CharField(source="company_vendor.vendor.name")
    vendor_logo = serializers.ImageField(source="company_vendor.vendor.logo")
    status = serializers.CharField(source="company_vendor.status")
    company_vendor_id = serializers.IntegerField(source="company_vendor.id")

    vendor_branch_name = serializers.CharField(source="vendor_branch.branch_name")

    class Meta:
        model = vendor_models.CompanyVendorBranch
        fields = [
            "company_vendor_id",
            "vendor_id",
            "vendor_name",
            "vendor_logo",
            "vendor_branch_name",
            "status",
            "service_opening_time",
            "service_closing_time",
        ]

class VendorBranchMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorBranch
        fields = ["id", "branch_name", "city", "state"]

class VendorListSerializer(serializers.ModelSerializer):
    branches = VendorBranchMiniSerializer(
        source="vendorbranch_set", many=True
    )

    class Meta:
        model = Vendor
        fields = ["id", "name", "logo", "branches"]

class VendorCompanySerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.name")

    class Meta:
        model = vendor_models.CompanyVendor
        fields = ["id", "company_name"]

class VendorDetailSerializer(serializers.ModelSerializer):
    branches = VendorBranchMiniSerializer(many=True, source="vendorbranch_set")
    companies = VendorCompanySerializer(
        many=True, source="vendor_companies"
    )

    class Meta:
        model = Vendor
        fields = ["id", "name", "logo", "branches", "companies"]

class CompanyFloorOptionSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = CompanyFloor
        fields = ["id", "display_name"]

    def get_display_name(self, obj):
        return f"{obj.building.branch.branch_name} - {obj.building.building_name} - {obj.floor_name}"

class CompanyVendorRequestSerializer(serializers.Serializer):
    vendor = serializers.IntegerField(write_only=True)
    vendor_branch = serializers.IntegerField(write_only=True)
    floor = serializers.IntegerField(write_only=True)

    id = serializers.IntegerField(read_only=True)
    status = serializers.CharField(read_only=True)

    def validate(self, attrs):
        company = self.context["request"].user.company

        if not CompanyFloor.objects.filter(
            id=attrs["floor"],
            building__branch__company=company
        ).exists():
            raise serializers.ValidationError(
                {"floor": "Invalid floor for this company"}
            )

        if not VendorBranch.objects.filter(
            id=attrs["vendor_branch"],
            vendor_id=attrs["vendor"]
        ).exists():
            raise serializers.ValidationError(
                {"vendor_branch": "Invalid vendor branch"}
            )

        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        company = request.user.company

        vendor_id = validated_data["vendor"]
        vendor_branch_id = validated_data["vendor_branch"]
        floor_id = validated_data["floor"]

        with transaction.atomic():
            # Company + Vendor is unique
            company_vendor, _ = vendor_models.CompanyVendor.objects.get_or_create(
                company=company,
                vendor_id=vendor_id,
            )

            branch_link, created = vendor_models.CompanyVendorBranch.objects.get_or_create(
                company_vendor=company_vendor,
                vendor_branch_id=vendor_branch_id,
                floor_id=floor_id,
                defaults={"status": "active"},
            )

        if created:
            company_floor = CompanyFloor.objects.get(id=floor_id)
            vendor_branch = VendorBranch.objects.get(id=vendor_branch_id)

            send_vendor_request_email(
                vendor_email="md.aqib@unthinkable.co",
                vendor_name=vendor_branch.vendor.name,
                company_name=company.name,
                branch_name=vendor_branch.branch_name,
                building_name=company_floor.building.building_name,
                floor_name=company_floor.floor_name,
                status=branch_link.vendor_acceptance_status,
            )

        print("company_vendor: ", company_vendor)
        return company_vendor

class VendorOnboardRequestSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.name", read_only=True)

    class Meta:
        model = vendor_models.CompanyVendor
        fields = ["id", "company_name", "status"]

class VendorDashboardStatsSerializer(serializers.Serializer):
    branches = serializers.IntegerField()
    workers = serializers.IntegerField()
    orders = serializers.IntegerField()

class VendorBranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorBranch
        fields = [
            "id",
            "branch_name",
            "city",
            "state",
            "country",
            "address",
        ]

class VendorOnboardRequestSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(
        source="company_vendor.company.name",
        read_only=True
    )
    floor = serializers.CharField(
        source="floor.floor_name",
        read_only=True
    )
    building = serializers.CharField(
        source="floor.building.building_name",
        read_only=True
    )

    class Meta:
        model = vendor_models.CompanyVendorBranch
        fields = [
            "id",
            "company_name",
            "floor",
            "building",
            "vendor_acceptance_status",
            "status",
        ]

class VendorWorkerSerializer(serializers.ModelSerializer):
    branch_name = serializers.CharField(
        source="vendor_branch.branch_name", read_only=True
    )

    class Meta:
        model = vendor_models.VendorWorker
        fields = [
            "id",
            "name",
            "phone",
            "role",
            "branch_name",
            "is_active",
        ]
