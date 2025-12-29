# common/permissions.py
from rest_framework.permissions import BasePermission

class IsCompanyAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and getattr(request.user.user_type, "name", "").lower() == "company"

class IsVendorAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and getattr(request.user.user_type, "name", "").lower() == "vendor"

class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return request.user and getattr(request.user.user_type, "name", "").lower() == "employee"
