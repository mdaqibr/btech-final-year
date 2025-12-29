from rest_framework_simplejwt.authentication import JWTAuthentication
from accounts.models import User


class AppJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user_id = validated_token.get("user_id")

        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None
