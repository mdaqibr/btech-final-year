from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from accounts.authentication import AppJWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers

from django.db.models import Q
from rest_framework.pagination import PageNumberPagination

from accounts.models import Company, CompanyBranch, CompanyBuilding, CompanyFloor, Vendor, VendorBranch
from accounts.serializers import (
    CompanyBranchSerializer,
    CompanyBuildingSerializer,
    CompanyFloorSerializer,
    FloorVendorSerializer,
    VendorListSerializer,
    VendorDetailSerializer,
    CompanyFloorOptionSerializer,
    CompanyVendorRequestSerializer,
    VendorOnboardRequestSerializer,
    VendorBranchSerializer,
    VendorWorkerSerializer
)
from accounts.permissions import IsCompany
from vendor import models as vendor_models

class VendorPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = "page_size"

class GetCompanyBranches(APIView):
    authentication_classes = [AppJWTAuthentication]
    permission_classes = [IsCompany]

    def get(self, request):
        company = Company.objects.get(user=request.user)
        branches = CompanyBranch.objects.filter(company=company)

        serializer = CompanyBranchSerializer(branches, many=True)
        return Response({
            "success": True,
            "data": serializer.data
        })


class AddCompanyBranches(APIView):
    """
    POST /accounts/companies/add-branches/
    """
    authentication_classes = [AppJWTAuthentication]
    permission_classes = [IsCompany]

    def post(self, request):
        company = Company.objects.get(user=request.user)
        branches = request.data.get("branches", [])
        
        print("company: ", company.__dict__)

        if not isinstance(branches, list):
            return Response({
                "success": False,
                "message": "branches must be a list"
            }, status=400)

        for branch in branches:
            CompanyBranch.objects.create(
                company=company,
                branch_name=branch.get("branch_name"),
                address=branch.get("address"),
                city=branch.get("city"),
                state=branch.get("state"),
                country=branch.get("country", "IN")
            )

        return Response({
            "success": True,
            "message": "Branches added successfully"
        })

class CompanyBranchBuildingsView(APIView):
    authentication_classes = [AppJWTAuthentication]
    permission_classes = [IsCompany]

    # --------------------------
    # GET → List all buildings
    # --------------------------
    def get(self, request, branch_id):
        try:
            # Validate branch
            try:
                CompanyBranch.objects.get(id=branch_id)
            except CompanyBranch.DoesNotExist:
                return Response(
                    {"error": "Branch not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            buildings = CompanyBuilding.objects.filter(branch_id=branch_id).order_by("created_at")

            data = [
                {
                    "id": b.id,
                    "building_name": b.building_name,
                    "floor_count": b.floor_count or 0
                }
                for b in buildings
            ]

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # --------------------------
    # POST → Add new building
    # --------------------------
    def post(self, request, branch_id):
        try:
            building_name = request.data.get("building_name")
            floor_count = request.data.get("floor_count")

            # Validate branch
            try:
                branch = CompanyBranch.objects.get(id=branch_id)
            except CompanyBranch.DoesNotExist:
                return Response(
                    {"error": "Branch not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Create building
            building = CompanyBuilding.objects.create(
                branch=branch,
                building_name=building_name,
                floor_count=floor_count
            )

            return Response(
                {
                    "message": "Building added successfully",
                    "building": {
                        "id": building.id,
                        "branch": branch.id,
                        "building_name": building.building_name,
                        "floor_count": building.floor_count
                    }
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CompanyBuildingFloorsView(APIView):
    authentication_classes = [AppJWTAuthentication]
    permission_classes = [IsCompany]

    def get(self, request, branch_id, building_id):
        print("HWOOOOOOOOOO")
        floors = CompanyFloor.objects.filter(building_id=building_id).order_by("floor_number")
        data = CompanyFloorSerializer(floors, many=True).data
        return Response(data)

    def post(self, request, branch_id, building_id):
        payload = request.data.copy()
        payload["building"] = building_id

        serializer = CompanyFloorSerializer(data=payload)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FloorVendorsView(APIView):
    authentication_classes = [AppJWTAuthentication]
    permission_classes = [IsCompany]

    def get(self, request, branch_id, building_id, floor_id):
        qs = (
            vendor_models.CompanyVendorBranch.objects
            .select_related(
                "company_vendor",
                "company_vendor__vendor",
                "vendor_branch",
                "floor",
            )
            .filter(floor_id=floor_id)
        )

        serializer = FloorVendorSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class VendorListView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def get(self, request):
        search = request.query_params.get("search", "").strip()

        qs = Vendor.objects.all().prefetch_related("vendorbranch_set")

        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(vendorbranch__branch_name__icontains=search) |
                Q(vendorbranch__city__icontains=search)
            ).distinct()

        paginator = VendorPagination()
        page = paginator.paginate_queryset(qs, request)

        serializer = VendorListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

class RequestVendorOnboardView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def post(self, request, vendor_id):
        company = request.user.company

        company_vendor, created = vendor_models.CompanyVendor.objects.get_or_create(
            company=company,
            vendor_id=vendor_id,
            defaults={"status": "pending"}
        )

        if not created:
            return Response(
                {"detail": "Vendor already requested or onboarded"},
                status=status.HTTP_400_BAD_REQUEST
            )

        vendor_models.VendorOnboardingAction.objects.create(
            company_vendor=company_vendor,
            action_type="request",
            performed_by_user=request.user,
        )

        return Response(
            {"detail": "Vendor onboarding request sent"},
            status=status.HTTP_201_CREATED
        )

class VendorDetailView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def get(self, request, vendor_id):
        vendor = Vendor.objects.prefetch_related(
            "vendorbranch_set",
            "vendor_companies__company",
        ).get(id=vendor_id)

        serializer = VendorDetailSerializer(vendor)
        return Response(serializer.data)

class CompanyFloorOptionsAPIView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def get(self, request):
        floors = CompanyFloor.objects.filter(
            building__branch__company=request.user.company
        ).select_related(
            "building",
            "building__branch"
        )

        serializer = CompanyFloorOptionSerializer(floors, many=True)
        return Response(serializer.data)


class CompanyVendorRequestAPIView(CreateAPIView):
    serializer_class = CompanyVendorRequestSerializer
    authentication_classes = [AppJWTAuthentication]

class VendorOnboardActionAPIView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def post(self, request, pk):
        action = request.data.get("action")

        if action not in ["approve", "reject"]:
            return Response({"detail": "Invalid action"}, status=400)

        obj = get_object_or_404(
            vendor_models.CompanyVendor,
            pk=pk,
            vendor__user=request.user
        )

        obj.status = "approved" if action == "approve" else "rejected"
        obj.save(update_fields=["status"])

        return Response({"status": obj.status})

class VendorDashboardStatsAPIView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def get(self, request):
        vendor = Vendor.objects.get(user=request.user)

        data = {
            "branches": VendorBranch.objects.filter(
                vendor=vendor
            ).count(),
            "workers": vendor_models.VendorWorker.objects.filter(
                vendor_branch__vendor=vendor,
                is_active=True
            ).count(),
            "orders": 0,
        }

        return Response(data)

class VendorBranchListAPIView(ListAPIView):
    serializer_class = VendorBranchSerializer
    authentication_classes = [AppJWTAuthentication]

    def get_queryset(self):
        return VendorBranch.objects.filter(
            vendor__user=self.request.user,
            is_active=True
        )

class VendorOnboardRequestListAPIView(ListAPIView):
    serializer_class = VendorOnboardRequestSerializer
    authentication_classes = [AppJWTAuthentication]

    def get_queryset(self):
        return (
            vendor_models.CompanyVendorBranch.objects
            .filter(
                company_vendor__vendor__user=self.request.user,
                vendor_acceptance_status="pending"
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

class VendorOnboardActionAPIView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def post(self, request, pk):
        print("request.data: ", request.data)
        status_data = request.data.get("status", {})
        action = status_data.get("status")
        rejection_reason = status_data.get("rejection_reason")

        print("action: ", action)

        if action not in ["approved", "rejected"]:
            raise ValidationError({"status": "Invalid action"})

        if action == "rejected" and not rejection_reason:
            raise ValidationError(
                {"rejection_reason": "Rejection reason is required"}
            )

        print("PK:", pk)

        company_vendor_branch = get_object_or_404(
            vendor_models.CompanyVendorBranch,
            pk=pk,
            company_vendor__vendor__user=request.user,
            vendor_acceptance_status="pending",
        )

        company_vendor_branch.vendor_acceptance_status = action
        company_vendor_branch.rejection_reason = rejection_reason
        company_vendor_branch.save(
            update_fields=["vendor_acceptance_status", "rejection_reason"]
        )

        vendor_models.VendorOnboardingAction.objects.create(
            company_vendor=company_vendor_branch.company_vendor,
            action_type="approve" if action == "approved" else "reject",
            performed_by_user=request.user,
            reason=rejection_reason,
        )

        return Response(
            {
                "status": company_vendor_branch.vendor_acceptance_status,
                "rejection_reason": rejection_reason,
            },
            status=status.HTTP_200_OK,
        )

class VendorWorkerListAPIView(ListAPIView):
    serializer_class = VendorWorkerSerializer
    authentication_classes = [AppJWTAuthentication]

    def get_queryset(self):
        return vendor_models.VendorWorker.objects.filter(
            vendor_branch__vendor__user=self.request.user,
            is_active=True
        ).select_related("vendor_branch")