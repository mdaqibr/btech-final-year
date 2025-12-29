from typing import List, Dict, Optional
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings


def send_email(
    *,
    subject: str,
    to: List[str],
    template: Optional[str] = None,
    context: Optional[Dict] = None,
    html_content: Optional[str] = None,
    from_email: Optional[str] = None,
    fail_silently: bool = False,
):
    """
    Global reusable email sender.
    """

    if not template and not html_content:
        raise ValueError("Either template or html_content is required")

    context = context or {}
    from_email = from_email or settings.EMAIL_HOST_USER

    if template:
        html_content = render_to_string(template, context)

    msg = EmailMultiAlternatives(
        subject=subject,
        body="",
        from_email=from_email,
        to=to,
    )
    msg.attach_alternative(html_content, "text/html")
    msg.send(fail_silently=fail_silently)
