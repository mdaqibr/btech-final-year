from django.http import JsonResponse
from django.core.cache import cache

class RateLimitMiddleware:
    """
    Limits: 1 request per 10 seconds for OTP send API
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        if request.path.endswith("/send-otp/"):
            ip = request.META.get("REMOTE_ADDR")
            key = f"otp_rate_{ip}"

            if cache.get(key):
                return JsonResponse({
                    "status": False,
                    "message": "Too many OTP requests. Try again in a few seconds."
                }, status=429)

            cache.set(key, True, timeout=10)

        return self.get_response(request)
