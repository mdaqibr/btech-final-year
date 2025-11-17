import random
from datetime import timedelta
from django.utils import timezone
from accounts.models import EmailOTP


def generate_otp():
    return str(random.randint(100000, 999999))


def create_or_update_otp(email):
    otp = generate_otp()
    expires_at = timezone.now() + timedelta(hours=1)

    EmailOTP.objects.update_or_create(
        email=email,
        defaults={
            "otp": otp,
            "expires_at": expires_at,
            "attempts": 0,
            "is_used": False,
        },
    )
    return otp


def verify_otp(email, otp_entered):
    """
    Central OTP validation logic.
    """

    try:
        obj = EmailOTP.objects.get(email=email)
    except EmailOTP.DoesNotExist:
        return False, "OTP not found"

    if obj.is_used:
        return False, "OTP already used"

    if obj.is_expired():
        return False, "OTP expired"

    if obj.attempts >= 5:
        return False, "Too many attempts. Please request a new OTP."

    if obj.otp != otp_entered:
        obj.attempts += 1
        obj.save()
        return False, "Invalid OTP"

    # OTP is valid
    obj.is_used = True
    obj.save()
    return True, "OTP verified successfully"
