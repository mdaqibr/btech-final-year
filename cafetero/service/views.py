# service/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import VendorService
from .serializers import VendorServiceSerializer
from common.permissions import IsCompanyAdmin, IsVendorAdmin
from accounts.models import Vendor

class VendorServiceViewSet(viewsets.ModelViewSet):
    queryset = VendorService.objects.all().select_related("company", "vendor", "branch", "building", "vendor_branch")
    serializer_class = VendorServiceSerializer

    def get_permissions(self):
        # Create requests: Company admin
        if self.action in ["create", "list", "retrieve", "my_requests"]:
            return [IsCompanyAdmin()]
        # Respond to requests: vendor admin
        if self.action in ["respond", "vendor_requests"]:
            return [IsVendorAdmin()]
        return []

    def list(self, request, *args, **kwargs):
        # Company admins get own company services
        user = request.user
        if getattr(user.user_type, "name", "").lower() == "company":
            # Find company associated with this user (your existing relation)
            company = getattr(user, "company", None)
            if not company:
                return Response({"detail": "Company not found for user"}, status=status.HTTP_404_NOT_FOUND)
            qs = self.queryset.filter(company=company)
            serializer = self.get_serializer(qs, many=True)
            return Response(serializer.data)
        return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

    @action(detail=True, methods=["post"], url_path="respond")
    def respond(self, request, pk=None):
        """
        Vendor admin responds to an onboard request: accept or reject with reason.
        """
        user = request.user
        if getattr(user.user_type, "name", "").lower() != "vendor":
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        try:
            vs = self.get_object()
        except:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        decision = request.data.get("decision")
        reason = request.data.get("reason", "")

        if decision not in ["accept", "reject"]:
            return Response({"detail": "decision must be accept or reject"}, status=status.HTTP_400_BAD_REQUEST)

        if decision == "accept":
            vs.status = VendorService.STATUS_ACCEPTED
            vs.rejected_reason = None
        else:
            vs.status = VendorService.STATUS_REJECTED
            vs.rejected_reason = reason

        vs.responded_by = user
        vs.responded_at = timezone.now()
        vs.save()
        return Response(VendorServiceSerializer(vs).data)
