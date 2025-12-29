# service/urls.py
from rest_framework.routers import DefaultRouter
from .views import VendorServiceViewSet

router = DefaultRouter()
router.register(r"vendor-services", VendorServiceViewSet, basename="vendor-service")

urlpatterns = router.urls