# employee/views.py
from accounts.authentication import AppJWTAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from accounts import models as account_models
from vendor import models as vendor_models
from employee import serializers as sez

class EmployeeDashboardAPIView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def get(self, request):
        employee = account_models.Employee.objects.filter(user=request.user).first()
        if not employee:
            return Response({"detail": "Employee profile not found"}, status=404)

        data = sez.EmployeeDashboardSerializer(employee).data
        return Response(data)

class BuildingFloorsAPIView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def get(self, request, building_id):
        employee = account_models.Employee.objects.filter(user=request.user).first()
        if not employee:
            return Response({"detail": "Employee profile not found"}, status=404)

        building = account_models.CompanyBuilding.objects.filter(
            id=building_id, branch=employee.branch
        ).first()

        if not building:
            return Response({"detail": "Building not found"}, status=404)

        floors = account_models.CompanyFloor.objects.filter(building=building).order_by("floor_number")
        return Response({
            "building_name": building.building_name,
            "floors": sez.FloorSerializer(floors, many=True).data
        })

class FloorVendorsAPIView(APIView):
    authentication_classes = [AppJWTAuthentication]

    def get(self, request, floor_id):
        employee = account_models.Employee.objects.filter(user=request.user).first()
        if not employee:
            return Response({"detail": "Employee profile not found"}, status=404)

        floor = account_models.CompanyFloor.objects.filter(
            id=floor_id,
            building__branch=employee.branch
        ).first()

        if not floor:
            return Response({"detail": "Floor not found"}, status=404)

        company_vendor_branches = vendor_models.CompanyVendorBranch.objects.filter(
            floor=floor,
            company_vendor__company=employee.company,
            vendor_acceptance_status="approved",
            status="active"
        ).select_related("vendor_branch__vendor")

        return Response({
            "floor_id": floor_id,
            "floor_name": floor.floor_name,
            "vendors": sez.FloorVendorSerializer(company_vendor_branches, many=True).data
        })