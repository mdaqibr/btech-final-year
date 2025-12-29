# vendor/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("branches/", views.VendorBranchListCreateAPIView.as_view()),
    path("branches/<int:pk>/", views.VendorBranchRetrieveUpdateDestroyAPIView.as_view()),
    path("workers/", views.VendorWorkerListCreateAPIView.as_view()),
    path("workers/<int:pk>/", views.VendorWorkerRetrieveUpdateDestroyAPIView.as_view()),
    path("approved-floors/", views.VendorApprovedFloorAPIView.as_view()),
]
