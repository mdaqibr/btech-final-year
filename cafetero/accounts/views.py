from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.serializers import (
    LoginSerializer, UserSerializer,
    CreateUserSerializer, SetPasswordSerializer, OTPVerifySerializer, CompanyInfoSerializer,
    BranchSerializer, BuildingSerializer, VendorInfoSerializer, VendorBranchSerializer,
    EmployeeInfoSerializer
)
from accounts.models import User, Company, UserType, CompanyBranch, CompanyBuilding, Vendor, Employee
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

def api_response(success, message, data=None, status_code=200):
    return Response({"success": success, "message": message, "data": data}, status=status_code)

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

# For vendor registration
class RegisterVendorUser(APIView):

    def post(self, request):
        try:
            ser = CreateUserSerializer(data=request.data)
            ser.is_valid(raise_exception=True)

            email = ser.validated_data["email"]

            user_type = UserType.objects.get(name="Vendor")

            user, created = User.objects.get_or_create(
                email=email,
                defaults={"user_type": user_type}
            )

            return api_response(True, "Vendor user initialized", {
                "user_id": user.id,
                "email": email,
                "user_type": user.user_type.name
            })

        except Exception as e:
            return api_response(False, str(e), 400)

class VendorSetPassword(APIView):

    def post(self, request):
        try:
            ser = SetPasswordSerializer(data=request.data)
            ser.is_valid(raise_exception=True)

            email = ser.validated_data["email"]
            password = ser.validated_data["password"]

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return api_response(False, "Vendor user not found", 404)

            user.password = make_password(password)
            user.save()

            return api_response(True, "Password set successfully")

        except Exception as e:
            return api_response(False, str(e), 400)

class VendorSendOTP(APIView):

    def post(self, request):
        try:
            email = request.data.get("email")
            if not email:
                return api_response(False, "Email is required", 400)

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return api_response(False, "Vendor user not found", 404)

            otp = create_or_update_otp(email)
            send_otp_email(email, otp)

            return api_response(True, "OTP sent successfully")

        except Exception as e:
            return api_response(False, str(e), 400)

class VendorVerifyOTP(APIView):

    def post(self, request):
        try:
            ser = OTPVerifySerializer(data=request.data)
            ser.is_valid(raise_exception=True)

            email = ser.validated_data["email"]
            otp_entered = ser.validated_data["otp"]

            ok, msg = verify_otp(email, otp_entered)
            if not ok:
                return api_response(False, msg, 400)

            return api_response(True, "Email verified")

        except Exception as e:
            return api_response(False, str(e), 400)

class UpdateVendorInfo(APIView):

    def post(self, request):
        try:
            email = request.data.get("email")
            if not email:
                return api_response(False, "Email is required", 400)

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return api_response(False, "Vendor user not found", 404)

            vendor, created = Vendor.objects.get_or_create(user=user)

            ser = VendorInfoSerializer(vendor, data=request.data, partial=True)
            ser.is_valid(raise_exception=True)
            ser.save()

            return api_response(True, "Vendor information updated", {
                "vendor_id": vendor.id
            })

        except Exception as e:
            return api_response(False, str(e), 400)

class AddVendorBranches(APIView):

    def post(self, request):
        try:
            data = request.data
            vendor_id = data.get("vendor_id")
            branches = data.get("branches", [])

            if not vendor_id:
                return api_response(False, "vendor_id is required", 400)

            try:
                vendor = Vendor.objects.get(id=vendor_id)
            except Vendor.DoesNotExist:
                return api_response(False, f"Vendor {vendor_id} not found", 404)

            created_branches = []

            for b in branches:
                br_ser = VendorBranchSerializer(data=b)
                br_ser.is_valid(raise_exception=True)
                branch = br_ser.save(vendor=vendor)

                created_branches.append(
                    VendorBranchSerializer(branch).data
                )

            return api_response(True, "Vendor branches added", {
                "branches": created_branches
            })

        except Exception as e:
            return api_response(False, str(e), 400)

class RegisterEmployeeUser(APIView):

    def post(self, request):
        try:
            ser = CreateUserSerializer(data=request.data)
            ser.is_valid(raise_exception=True)

            email = ser.validated_data["email"]

            user_type = UserType.objects.get(name="Employee")

            user, created = User.objects.get_or_create(
                email=email,
                defaults={"user_type": user_type}
            )

            return api_response(True, "Employee user initialized", {
                "user_id": user.id,
                "email": email,
                "user_type": user.user_type.name
            })

        except Exception as e:
            return api_response(False, str(e), 400)

class EmployeeSetPassword(APIView):

    def post(self, request):
        try:
            ser = SetPasswordSerializer(data=request.data)
            ser.is_valid(raise_exception=True)

            email = ser.validated_data["email"]
            password = ser.validated_data["password"]

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return api_response(False, "Employee user not found", 404)

            user.password = make_password(password)
            user.save()

            return api_response(True, "Password set successfully")

        except Exception as e:
            return api_response(False, str(e), 400)

class EmployeeSendOTP(APIView):

    def post(self, request):
        try:
            email = request.data.get("email")
            if not email:
                return api_response(False, "Email is required", 400)

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return api_response(False, "Employee user not found", 404)

            otp = create_or_update_otp(email)
            send_otp_email(email, otp)

            return api_response(True, "OTP sent successfully")

        except Exception as e:
            return api_response(False, str(e), 400)

class EmployeeVerifyOTP(APIView):

    def post(self, request):
        try:
            ser = OTPVerifySerializer(data=request.data)
            ser.is_valid(raise_exception=True)

            email = ser.validated_data["email"]
            otp_entered = ser.validated_data["otp"]

            ok, msg = verify_otp(email, otp_entered)
            if not ok:
                return api_response(False, msg, 400)

            return api_response(True, "Email verified")

        except Exception as e:
            return api_response(False, str(e), 400)

class UpdateEmployeeInfo(APIView):
    def post(self, request):
        try:
            print("request.data>>: ", request.data)

            email = request.data.get("email")
            if not email:
                return api_response(False, "Email is required", None, status_code=400)

            # find user
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return api_response(False, "Employee user not found", None, status_code=404)

            # try to parse numeric IDs (frontend sends strings). Return friendly error if invalid.
            def parse_int_field(name):
                v = request.data.get(name)
                if v is None or v == "":
                    return None
                try:
                    return int(v)
                except (ValueError, TypeError):
                    raise ValidationError({name: [f"Invalid {name} id"]})

            try:
                clean_data = {
                    "full_name": request.data.get("full_name"),
                    "company": parse_int_field("company"),
                    "branch": parse_int_field("branch"),
                    "building": parse_int_field("building"),
                    "employee_code": request.data.get("employee_code"),
                }
            except ValidationError as ve:
                # ve.detail is a dict of field errors
                # Convert to readable message
                first_field, msgs = next(iter(ve.detail.items()))
                return api_response(False, f"{first_field}: {msgs[0]}", None, status_code=400)

            # ensure required fields exist (company, branch, full_name, employee_code)
            required = ["full_name", "company", "branch", "employee_code"]
            missing = [f for f in required if not clean_data.get(f)]
            if missing:
                return api_response(False, f"Missing fields: {', '.join(missing)}", None, status_code=400)

            # get related objects existence check (give helpful message if not found)
            try:
                company_obj = Company.objects.get(id=clean_data["company"])
            except Company.DoesNotExist:
                return api_response(False, "Selected company not found", None, status_code=404)

            try:
                branch_obj = CompanyBranch.objects.get(id=clean_data["branch"], company=company_obj)
            except CompanyBranch.DoesNotExist:
                return api_response(False, "Selected branch not found for the chosen company", None, status_code=404)

            # building may be optional in model (your model allows null), but you told it must be present:
            try:
                building_obj = CompanyBuilding.objects.get(id=clean_data["building"], branch=branch_obj)
            except CompanyBuilding.DoesNotExist:
                return api_response(False, "Selected building not found for the chosen branch", None, status_code=404)

            # load existing employee (if exists)
            employee = Employee.objects.filter(user=user).first()

            # Build serializer and validate explicitly so we can return serializer errors nicely
            if employee:
                ser = EmployeeInfoSerializer(employee, data=clean_data)
            else:
                ser = EmployeeInfoSerializer(data=clean_data)

            if not ser.is_valid():
                # format first error to a friendly message
                errors = ser.errors
                # create a compact message
                field, msgs = next(iter(errors.items()))
                msg_text = msgs[0] if isinstance(msgs, (list, tuple)) else str(msgs)
                return api_response(False, f"{field}: {msg_text}", None, status_code=400)

            # Save: if creating new employee, ensure we attach user
            if employee:
                ser.save()
            else:
                ser.save(user=user)

            return api_response(True, "Employee information updated", {
                "employee_id": employee.id if employee else ser.instance.id
            }, status_code=200)

        except ValidationError as ve:
            # DRF ValidationError - send user-friendly message
            err = ve.detail
            # choose first message
            if isinstance(err, dict):
                field, msgs = next(iter(err.items()))
                txt = msgs[0] if isinstance(msgs, (list, tuple)) else str(msgs)
            else:
                txt = str(err)
            return api_response(False, txt, None, status_code=400)

        except Exception as e:
            # log the real error server-side
            print("ERROR >>>", e)
            # return a generic message to client (not DB trace)
            return api_response(False, "Something went wrong. Please try again.", None, status_code=400)


class GetCompanies(APIView):
    def get(self, request):
        companies = Company.objects.all().values("id", "name")
        return api_response(True, "OK", list(companies), 200)


class GetBranches(APIView):
    def get(self, request, company_id):
        branches = CompanyBranch.objects.filter(company_id=company_id).values("id", "branch_name")
        return api_response(True, "OK", list(branches), 200)


class GetBuildings(APIView):
    def get(self, request, branch_id):
        buildings = CompanyBuilding.objects.filter(branch_id=branch_id).values("id", "building_name")
        return api_response(True, "OK", list(buildings), 200)