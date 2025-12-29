# service/serializers.py
from rest_framework import serializers
from .models import VendorService
from accounts.models import Company, CompanyBranch, CompanyBuilding, Vendor, VendorBranch

class VendorBranchBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorBranch
        fields = ["id", "branch_name", "city", "state", "country"]

class VendorBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ["id", "name", "logo"]

class VendorServiceSerializer(serializers.ModelSerializer):
    vendor = VendorBasicSerializer(read_only=True)
    vendor_id = serializers.PrimaryKeyRelatedField(queryset=Vendor.objects.all(), write_only=True)
    vendor_branch_id = serializers.PrimaryKeyRelatedField(queryset=VendorBranch.objects.all(), write_only=True)
    company_id = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), write_only=True)
    branch_id = serializers.PrimaryKeyRelatedField(queryset=CompanyBranch.objects.all(), write_only=True)
    building_id = serializers.PrimaryKeyRelatedField(queryset=CompanyBuilding.objects.all(), write_only=True)

    class Meta:
        model = VendorService
        fields = [
            "id", "company", "company_id", "branch", "branch_id", "building", "building_id",
            "vendor", "vendor_id", "vendor_branch_id", "vendor_branch",
            "status", "rejected_reason", "requested_by", "responded_by", "created_at", "responded_at"
        ]
        read_only_fields = ["status", "rejected_reason", "requested_by", "responded_by", "created_at", "responded_at"]

    def create(self, validated_data):
        # Pop the pk fields
        company = validated_data.pop("company_id")
        branch = validated_data.pop("branch_id")
        building = validated_data.pop("building_id")
        vendor = validated_data.pop("vendor_id")
        vendor_branch = validated_data.pop("vendor_branch_id")

        vs = VendorService.objects.create(
            company=company,
            branch=branch,
            building=building,
            vendor=vendor,
            vendor_branch=vendor_branch,
            requested_by=self.context["request"].user
        )
        return vs
