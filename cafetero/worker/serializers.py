# worker/serializers.py
from rest_framework import serializers
from vendor import models as vendor_models

class WorkerLoginSerializer(serializers.Serializer):
    login_id = serializers.CharField()
    pin_code = serializers.CharField(write_only=True)

    def validate(self, data):
        login_id = data["login_id"]
        pin_code = data["pin_code"]

        try:
            worker = vendor_models.VendorWorker.objects.get(login_id=login_id, is_active=True)
        except vendor_models.VendorWorker.DoesNotExist:
            raise serializers.ValidationError("Invalid Login ID or PIN")

        if worker.pin_code != pin_code:
            raise serializers.ValidationError("Invalid Login ID or PIN")

        data["worker"] = worker
        return data