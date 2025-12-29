# importer/serializers.py
from rest_framework import serializers
from .models import EmployeeImportLog

class EmployeeImportLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeImportLog
        fields = "__all__"
        read_only_fields = ["status","uploaded_by","created_at","finished_at","success_rows","failed_rows"]
