from django.urls import path
from notifications import views

urlpatterns = [
    path("my/", views.MyNotificationsView.as_view()),
    path("read/<int:notification_id>/", views.MarkNotificationReadView.as_view()),
]
