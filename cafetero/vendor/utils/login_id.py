import re


def generate_worker_login_id(*, worker_id: int, vendor_name: str) -> str:
    """
    Example:
    vendor.name = "Aqib Vendor"
    worker.id = 3
    → AQIB0003
    """

    # Clean vendor name (letters only)
    cleaned = re.sub(r"[^A-Za-z]", "", vendor_name or "").upper()
    vendor_code = cleaned[:2].upper().ljust(2, "X")

    worker_part = str(worker_id)[-4:].zfill(4)

    login_id =  f"{vendor_code}{worker_part}"
    print("prepare login_id is: ", login_id)
    return login_id
