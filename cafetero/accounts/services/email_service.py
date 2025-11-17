from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

def send_otp_email(email, otp):
    subject = "Your Cafetero Email Verification OTP"
    html_content = render_to_string("otp_email.html", {"otp": otp})

    msg = EmailMultiAlternatives(
        subject,
        "",
        settings.EMAIL_HOST_USER,
        [email],
    )
    msg.attach_alternative(html_content, "text/html")
    msg.send()
