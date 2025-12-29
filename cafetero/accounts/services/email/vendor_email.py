from accounts.services.email.sender import send_email


def send_vendor_request_email(
    *,
    vendor_email: str,
    vendor_name: str,
    company_name: str,
    floor_name: str,
    building_name: str,
    branch_name: str,
    status: str,
):
    send_email(
        subject=f"New Vendor Request from {company_name}",
        to=[vendor_email],
        template="emails/vendor_request.html",
        context={
            "vendor_name": vendor_name,
            "company_name": company_name,
            "floor_name": floor_name,
            "building_name": building_name,
            "branch_name": branch_name,
            "status": status.capitalize(),
            "brand_name": "Cafetero",
        },
    )
