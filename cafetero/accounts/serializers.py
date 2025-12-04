from rest_framework import serializers
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from .models import User, Company, CompanyBranch, CompanyBuilding, Vendor, VendorBranch, Employee


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