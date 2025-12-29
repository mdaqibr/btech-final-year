# vendor/serializers.py
from rest_framework import serializers
from accounts import models as account_models
from vendor import models as vendor_models
from vendor.utils.login_id import generate_worker_login_id
from django.db import transaction

class VendorBranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = account_models.VendorBranch
        fields = [
            "id",
            "branch_name",
            "city",
            "state",
            "country",
            "address",
        ]
        read_only_fields = ["id", "country"]

class VendorBranchCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = account_models.VendorBranch
        fields = ["branch_name", "city", "state", "address"]

class VendorWorkerSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source="get_role_display", read_only=True)
    branch_name = serializers.CharField(source="vendor_branch.branch_name", read_only=True)
    floor_name = serializers.CharField(source="company_floor.floor_name", read_only=True)
    is_active = serializers.BooleanField()
    login_id = serializers.CharField(read_only=True)

    class Meta:
        model = vendor_models.VendorWorker
        fields = [
            "id",
            "name",
            "login_id",
            "phone",
            "role",
            "role_display",
            "pin_code",
            "branch_name",
            "floor_name",
            "is_active",
            "vendor_branch",
            "company_floor",
        ]


class VendorWorkerCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = vendor_models.VendorWorker
        fields = [
            "vendor_branch",
            "company_floor",
            "name",
            "phone",
            "role",
            "pin_code",
            "is_active",
        ]

    def create(self, validated_data):
        with transaction.atomic():
            # create with temporary unique placeholder
            worker = vendor_models.VendorWorker.objects.create(
                **validated_data
            )

            vendor_name = worker.vendor_branch.vendor.name
            worker.login_id = generate_worker_login_id(
                worker_id=worker.id,
                vendor_name=vendor_name,
            )

            worker.save(update_fields=["login_id"])

        return worker

class VendorApprovedFloorSerializer(serializers.Serializer):
    company_id = serializers.IntegerField(
        source="company_vendor.company.id",
        read_only=True
    )
    company_name = serializers.CharField(
        source="company_vendor.company.name",
        read_only=True
    )

    company_branch_id = serializers.IntegerField(
        source="floor.building.branch.id",
        read_only=True
    )
    company_branch_name = serializers.CharField(
        source="floor.building.branch.branch_name",
        read_only=True
    )

    building_id = serializers.IntegerField(
        source="floor.building.id",
        read_only=True
    )
    building_name = serializers.CharField(
        source="floor.building.building_name",
        read_only=True
    )

    floor_id = serializers.IntegerField(
        source="floor.id",
        read_only=True
    )
    floor_name = serializers.CharField(
        source="floor.floor_name",
        read_only=True
    )

    vendor_branch_id = serializers.IntegerField(
        source="vendor_branch.id",
        read_only=True
    )
    vendor_branch_name = serializers.CharField(
        source="vendor_branch.branch_name",
        read_only=True
    )

    class Meta:
        model = vendor_models.CompanyVendorBranch
        fields = [
            "id",
            "company_id",
            "company_name",
            "company_branch_id",
            "company_branch_name",
            "building_id",
            "building_name",
            "floor_id",
            "floor_name",
            "vendor_branch_id",
            "vendor_branch_name",
        ]


