from rest_framework.permissions import BasePermission


class IsCompany(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user is not None
            and request.user.user_type.name == "Company"
        )


class IsVendor(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user is not None
            and request.user.user_type.name == "Vendor"
        )


class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user is not None
            and request.user.user_type.name == "Employee"
        )
