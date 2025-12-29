# importer/urls.py
from django.urls import path
from .views import EmployeeImportCreateView, EmployeeImportStatusView

urlpatterns = [
    path("upload/", EmployeeImportCreateView.as_view()),
    path("status/<int:import_id>/", EmployeeImportStatusView.as_view()),
]
