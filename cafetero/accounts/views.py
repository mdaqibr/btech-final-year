from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password

from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.serializers import (
    LoginSerializer, UserSerializer,
    RegisterCompanySerializer, RegisterVendorSerializer,
    RegisterEmployeeSerializer,
    CreateUserSerializer, SetPasswordSerializer, OTPVerifySerializer, CompanyInfoSerializer,
    BranchSerializer, BuildingSerializer
)
from accounts.models import User, Company, UserType, CompanyBranch, CompanyBuilding
from accounts.services.otp_service import create_or_update_otp, verify_otp
from accounts.services.email_service import send_otp_email

# LOGIN
class LoginView(APIView):
    def post(self, request):
        print("request-data: ", request.data)
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data
        })


# REFRESH TOKEN
class RefreshTokenAPI(TokenRefreshView):
    """
    POST {"refresh": "..."} -> new access token
    """
    pass


# LOGOUT
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        token = request.data.get("refresh")
        try:
            RefreshToken(token).blacklist()
            return Response({"message": "Logged out"})
        except Exception:
            return Response({"error": "Invalid token"}, status=400)


# PROFILE
class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


# REGISTER API's
class RegisterCompanyView(APIView):
    def post(self, request):
        serializer = RegisterCompanySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Company registered"}, status=201)


class RegisterVendorView(APIView):
    def post(self, request):
        serializer = RegisterVendorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Vendor registered"}, status=201)


class RegisterEmployeeView(APIView):
    def post(self, request):
        serializer = RegisterEmployeeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Employee registered"}, status=201)

# ---------------------
# Helper response format
# ---------------------
def api_response(success, message, data=None, status_code=200):
    return Response({"success": success, "message": message, "data": data}, status=status_code)


# ---------------------------------------------------------
# API 1 — Create user & company (initial record only)
# ---------------------------------------------------------
class RegisterCompanyUser(APIView):

    def post(self, request):
        try:
            print("request.data: ", request.data)
            ser = CreateUserSerializer(data=request.data)
            ser.is_valid(raise_exception=True)
            email = ser.validated_data["email"]

            user_type = UserType.objects.get(name="Company")
            user, created = User.objects.get_or_create(
                email=email,
                defaults={"user_type": user_type}
            )

            return api_response(True, "User initialized", {
                "user_id": user.id,
                "email": email,
                "user_type": user.user_type.name
            })

        except Exception as e:
            return api_response(False, str(e), status_code=400)


# ---------------------------------------------------------
# API 2 — Set password
# ---------------------------------------------------------
class SetPassword(APIView):

    def post(self, request):
        try:
            ser = SetPasswordSerializer(data=request.data)
            ser.is_valid(raise_exception=True)

            email = ser.validated_data["email"]
            password = ser.validated_data["password"]

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return api_response(False, "User not found", status_code=404)

            user.password = make_password(password)
            user.save()

            return api_response(True, "Password set successfully")

        except Exception as e:
            return api_response(False, str(e), status_code=400)


# ---------------------------------------------------------
# API 3 — Send OTP
# ---------------------------------------------------------
class SendOTP(APIView):

    def post(self, request):
        try:
            email = request.data.get("email")
            if not email:
                return api_response(False, "Email is required", status_code=400)

            user = User.objects.get(email=email)

            if not user:
                return api_response(False, "User not found", status_code=404)

            otp = create_or_update_otp(email)
            send_otp_email(email, otp)

            return api_response(True, "OTP sent successfully")

        except Exception as e:
            return api_response(False, str(e), status_code=400)


# ---------------------------------------------------------
# API 4 — Verify OTP
# ---------------------------------------------------------
class VerifyOTP(APIView):

    def post(self, request):
        try:
            print("request.data: ", request.data)
            ser = OTPVerifySerializer(data=request.data)
            ser.is_valid(raise_exception=True)

            email = ser.validated_data["email"]
            otp_entered = ser.validated_data["otp"]

            ok, msg = verify_otp(email, otp_entered)
            if not ok:
                return api_response(False, msg, status_code=400)

            return api_response(True, "Email verified")

        except Exception as e:
            return api_response(False, str(e), status_code=400)


# ---------------------------------------------------------
# API 5 — Update company info
# ---------------------------------------------------------
class UpdateCompanyInfo(APIView):

    def post(self, request):
        try:
            print("request.data > ", request.data)
            email = request.data.get("email")
            if not email:
                return api_response(False, "Email is required", 400)

            # Get User
            try:
                user = User.objects.get(email="md.aqib@unthinkable.co")
            except User.DoesNotExist:
                return api_response(False, "User not found", 404)

            # Get or create company linked to user
            company, created = Company.objects.get_or_create(user=user)

            # Serialize update
            ser = CompanyInfoSerializer(company, data=request.data, partial=True)
            ser.is_valid(raise_exception=True)
            ser.save()

            return api_response(True, "Company information updated", {
                "company_id": company.id
            })

        except Exception as e:
            return api_response(False, str(e), 400)


class AddBranchesAndBuildings(APIView):

    def post(self, request):
        try:
            data = request.data
            print("data>>>> :", data)

            company_id = data.get("company_id")
            branches = data.get("branches", [])

            if not company_id:
                return api_response(False, "company_id is required", 400)

            try:
                company = Company.objects.get(id=company_id)
            except Company.DoesNotExist:
                return api_response(False, f"Company {company_id} not found", 404)

            if not isinstance(branches, list):
                return api_response(False, "branches must be a list", 400)

            created_branches = []

            for b in branches:

                branch_ser = BranchSerializer(data=b)
                branch_ser.is_valid(raise_exception=True)

                branch = branch_ser.save(company=company)

                building_list = b.get("buildings", [])
                building_objs = []

                for bl in building_list:
                    bl_ser = BuildingSerializer(
                        data={**bl, "branch": branch.id}
                    )
                    bl_ser.is_valid(raise_exception=True)
                    building_objs.append(bl_ser.save())

                created_branches.append({
                    "branch": BranchSerializer(branch).data,
                    "buildings": BuildingSerializer(building_objs, many=True).data
                })

            return api_response(
                True,
                "Branches & Buildings added successfully",
                {"branches": created_branches}
            )

        except Exception as e:
            return api_response(False, str(e), 400)