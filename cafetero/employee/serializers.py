# employee/serializers.py
from rest_framework import serializers
from accounts import models as account_models
from vendor import models as vendor_models


class BuildingSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="building_name")

    class Meta:
        model = account_models.CompanyBuilding
        fields = ["id", "name", "floor_count"]

class EmployeeDashboardSerializer(serializers.ModelSerializer):
    branch_name = serializers.CharField(source="branch.branch_name")
    buildings = serializers.SerializerMethodField()

    class Meta:
        model = account_models.Employee
        fields = ["full_name", "employee_code", "branch_name", "buildings"]

    def get_buildings(self, obj):
        qs = account_models.CompanyBuilding.objects.filter(branch=obj.branch)
        return BuildingSerializer(qs, many=True).data

class FloorSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="floor_name")

    class Meta:
        model = account_models.CompanyFloor
        fields = ["id", "name", "floor_number"]

class FloorVendorSerializer(serializers.ModelSerializer):
    vendor_id = serializers.IntegerField(source="vendor_branch.vendor.id")
    vendor_name = serializers.CharField(source="vendor_branch.vendor.name")
    branch_id = serializers.IntegerField(source="vendor_branch.id")
    branch_name = serializers.CharField(source="vendor_branch.branch_name")
    city = serializers.CharField(source="vendor_branch.city")
    opening = serializers.TimeField(source="service_opening_time")
    closing = serializers.TimeField(source="service_closing_time")
    special_meal = serializers.CharField()

    class Meta:
        model = vendor_models.CompanyVendorBranch
        fields = [
            "id",
            "vendor_id",
            "vendor_name",
            "branch_id",
            "branch_name",
            "city",
            "opening",
            "closing",
            "special_meal",
        ]