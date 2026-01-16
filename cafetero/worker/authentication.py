# worker/authentication.py

from vendor.models import VendorWorker
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

class WorkerJWTAuthentication(JWTAuthentication):

    def get_user(self, validated_token):
        if validated_token.get("type") != "Worker":
            raise AuthenticationFailed("Invalid worker token")

        user_id = validated_token.get("user_id")

        try:
            return VendorWorker.objects.get(id=user_id)
        except VendorWorker.DoesNotExist:
            raise AuthenticationFailed("Worker not found")
