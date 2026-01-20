# notifications/admin.py

from django.contrib import admin
from .models import AppNotification


@admin.register(AppNotification)
class AppNotificationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "title",
        "is_read",
        "created_at",
    )
    list_filter = (
        "is_read",
        "created_at",
    )
    search_fields = (
        "title",
        "message",
        "user__email",
    )
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)
    list_select_related = ("user",)

    fieldsets = (
        ("User Info", {
            "fields": ("user",)
        }),
        ("Notification Content", {
            "fields": ("title", "message")
        }),
        ("Status", {
            "fields": ("is_read",)
        }),
        ("Timestamps", {
            "fields": ("created_at",)
        }),
    )
