from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from .serializers import (
    LoginSerializer, UserSerializer,
    RegisterCompanySerializer, RegisterVendorSerializer,
    RegisterEmployeeSerializer
)
from .models import User


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
