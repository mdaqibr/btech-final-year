# importer/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import EmployeeImportLog
from .serializers import EmployeeImportLogSerializer
from common.permissions import IsCompanyAdmin
from django.core.files.storage import default_storage
from django.conf import settings
import uuid

class EmployeeImportCreateView(APIView):
    permission_classes = [IsCompanyAdmin]
    def post(self, request):
        """
        multipart form upload file
        """
        file_obj = request.FILES.get("file")
        company_id = request.data.get("company_id")
        if not file_obj or not company_id:
            return Response({"detail":"file and company_id required"}, status=status.HTTP_400_BAD_REQUEST)
        # Save file to storage (local or s3) and register import log
        filename = f"imports/{uuid.uuid4().hex}_{file_obj.name}"
        saved = default_storage.save(filename, file_obj)
        log = EmployeeImportLog.objects.create(company_id=company_id, uploaded_by=request.user, file_name=file_obj.name, s3_key=saved, status=EmployeeImportLog.STATUS_PENDING)
        # Here you should enqueue a background worker with log.id
        # Example: tasks.process_employee_import.delay(log.id)
        return Response({"import_id": log.id}, status=status.HTTP_201_CREATED)

class EmployeeImportStatusView(APIView):
    permission_classes = [IsCompanyAdmin]
    def get(self, request, import_id):
        try:
            log = EmployeeImportLog.objects.get(id=import_id)
        except EmployeeImportLog.DoesNotExist:
            return Response({"detail":"not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(EmployeeImportLogSerializer(log).data)
