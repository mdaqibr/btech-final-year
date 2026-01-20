from .models import AppNotification


def send_app_notification(user, title, message):
    print("user:", user)
    print("title:", title)
    print("message:", message)
    AppNotification.objects.create(
        user=user,
        title=title,
        message=message,
    )
