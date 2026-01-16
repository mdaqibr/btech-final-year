from django.conf import settings
from rest_framework.exceptions import PermissionDenied

class ServiceTokenAuthentication:
    def authenticate(self, request):
        token=request.headers.get("X-SERVICE-SECRET")
        if token != settings.SERVICE_SECRET:
            raise PermissionDenied("Unauthorized service")
        return (None,None)