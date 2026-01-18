from accounts.models import User
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

class AppJWTAuthentication(JWTAuthentication):

    def get_user(self, validated_token):
        user_id = validated_token.get("user_id")

        try:
            return User.objects.get(id=user_id)
        except VendorWorker.DoesNotExist:
            raise AuthenticationFailed("Worker not found")