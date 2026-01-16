# vendor/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny 
from accounts.authentication import AppJWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from accounts import models as account_models
from vendor import models as vendor_models
from order import models as order_models

from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
    ListCreateAPIView
)

from vendor import serializers as sez

class VendorBranchListCreateAPIView(ListCreateAPIView):
    authentication_classes = [AppJWTAuthentication]

    def get_queryset(self):
        print("HE!!!")
        return account_models.VendorBranch.objects.filter(
            vendor__user=self.request.user
        )

    def get_serializer_class(self):
        print("HE!!!!!")
        return (
            sez.VendorBranchCreateSerializer
            if self.request.method == "POST"
            else sez.VendorBranchSerializer
        )

    def perform_create(self, serializer):
        print("HE!!!!!!")
        vendor = account_models.Vendor.objects.get(user=self.request.user)
        serializer.save(vendor=vendor)

class VendorBranchRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [AppJWTAuthentication]
    serializer_class = sez.VendorBranchCreateSerializer

    def get_queryset(self):
        return account_models.VendorBranch.objects.filter(
            vendor__user=self.request.user
        )

class VendorApprovedFloorAPIView(ListAPIView):
    authentication_classes = [AppJWTAuthentication]
    serializer_class = sez.VendorApprovedFloorSerializer

    def get_queryset(self):
        return (
            vendor_models.CompanyVendorBranch.objects
            .filter(
                company_vendor__vendor__user=self.request.user,
                vendor_acceptance_status="approved",
                status="active",
            )
            .select_related(
                "company_vendor",
                "company_vendor__company",
                "vendor_branch",
                "floor",
                "floor__building",
                "floor__building__branch",
            )
        )

class VendorOnboardedStructureAPIView(ListAPIView):
    authentication_classes = [AppJWTAuthentication]
    serializer_class = sez.VendorOnboardedStructureSerializer

    def get_queryset(self):
        vendor_branch_id = self.request.query_params.get("vendor_branch_id")

        qs = vendor_models.CompanyVendorBranch.objects.filter(
            vendor_acceptance_status="approved",
            status="active",
            company_vendor__vendor__user=self.request.user,
        ).select_related(
            "company_vendor__company",
            "vendor_branch",
            "floor__building__branch",
        )

        if vendor_branch_id:
            qs = qs.filter(vendor_branch_id=vendor_branch_id)

        return qs

class VendorWorkerListCreateAPIView(ListCreateAPIView):
    authentication_classes = [AppJWTAuthentication]

    def get_queryset(self):
        return vendor_models.VendorWorker.objects.filter(
            vendor_branch__vendor__user=self.request.user
        )

    def get_serializer_class(self):
        return (
            sez.VendorWorkerCreateSerializer
            if self.request.method == "POST"
            else sez.VendorWorkerSerializer
        )

class VendorWorkerRetrieveUpdateDestroyAPIView(
    RetrieveUpdateDestroyAPIView
):
    authentication_classes = [AppJWTAuthentication]
    serializer_class = sez.VendorWorkerCreateSerializer

    def get_queryset(self):
        return vendor_models.VendorWorker.objects.filter(
            vendor_branch__vendor__user=self.request.user
        )