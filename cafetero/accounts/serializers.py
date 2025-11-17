from rest_framework import serializers
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from .models import User, Company, CompanyBranch, CompanyBuilding, Vendor, Employee, UserType


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


class RegisterCompanySerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Company
        fields = ("email", "password", "name", "domain", "logo", "bio", "location")

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password")

        user_type = UserType.objects.get(name="Company")

        user = User.objects.create(
            email=email,
            password=make_password(password),
            user_type=user_type
        )
        return Company.objects.create(user=user, **validated_data)


class RegisterVendorSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Vendor
        fields = ("email", "password", "name", "logo")

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password")

        user_type = UserType.objects.get(name="Vendor")

        user = User.objects.create(
            email=email,
            password=make_password(password),
            user_type=user_type
        )
        return Vendor.objects.create(user=user, **validated_data)


class RegisterEmployeeSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Employee
        fields = ("email", "password", "full_name", "employee_code", "company", "branch", "building")

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password")

        user_type = UserType.objects.get(name="Employee")

        user = User.objects.create(
            email=email,
            password=make_password(password),
            user_type=user_type
        )

        return Employee.objects.create(user=user, **validated_data)

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