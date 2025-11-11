from accounts.models import User
from rest_framework_simplejwt.authentication import JWTAuthentication

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user_id = validated_token.get("user_id")

        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None
