from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.authentication import AppJWTAuthentication
from .models import AppNotification
from .serializers import AppNotificationSerializer


class MyNotificationsView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def get(self, request):
        print("GET notifiction")

        qs = AppNotification.objects.filter(user=request.user)
        serializer = AppNotificationSerializer(qs, many=True)
        return Response(serializer.data)


class MarkNotificationReadView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def post(self, request, notification_id):
        AppNotification.objects.filter(
            id=notification_id, user=request.user
        ).update(is_read=True)
        return Response({"success": True})
