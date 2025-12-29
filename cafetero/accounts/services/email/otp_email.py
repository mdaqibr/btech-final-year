from accounts.services.email.sender import send_email


def send_otp_email(*, email: str, otp: str):
    send_email(
        subject="Your Cafetero Email Verification OTP",
        to=[email],
        template="emails/otp_email.html",
        context={
            "otp": otp,
            "brand_name": "Cafetero",
        },
    )
