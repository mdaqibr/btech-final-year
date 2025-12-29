import { Check, X, Inbox, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { getVendorRequests, updateVendorRequest } from "../../../api/vendor";

export default function VendorRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ✅ Modal messages
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    setLoading(true);
    getVendorRequests()
      .then((res) => setRequests(res.data))
      .finally(() => setLoading(false));
  };

  /* ---------------- APPROVE ---------------- */
  const handleApprove = (id) => {
    if (!window.confirm("Are you sure you want to approve this request?"))
      return;

    updateVendorRequest(id, { status: "approved" }).then(() => {
      setRequests((prev) => prev.filter((r) => r.id !== id));
    });
  };

  /* ---------------- OPEN REJECT MODAL ---------------- */
  const openRejectModal = (req) => {
    setSelectedRequest(req);
    setRejectionReason("");
    setModalError("");
    setModalSuccess("");
    setShowRejectModal(true);
  };

  /* ---------------- SUBMIT REJECTION ---------------- */
  const submitRejection = () => {
    if (!rejectionReason.trim()) {
      setModalError("Rejection reason is required.");
      return;
    }

    setSubmitting(true);
    setModalError("");
    setModalSuccess("");

    updateVendorRequest(selectedRequest.id, {
      status: "rejected",
      rejection_reason: rejectionReason,
    })
      .then(() => {
        setModalSuccess("Request rejected successfully.");

        setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));

        // Auto-close modal after success
        setTimeout(() => {
          closeRejectModal();
        }, 1200);
      })
      .catch((err) => {
        setModalError(
          err?.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      })
      .finally(() => setSubmitting(false));
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectionReason("");
    setModalError("");
    setModalSuccess("");
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return <div className="skeleton mb-4" style={{ height: 120 }} />;
  }

  /* ---------------- EMPTY STATE ---------------- */
  if (!requests.length) {
    return (
      <>
        <h5 className="fw-bold mb-3">Company Onboard Requests</h5>

        <div className="vendor-card card border-0 p-4 text-center">
          <div className="d-flex flex-column align-items-center gap-2">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 56,
                height: 56,
                background: "rgba(13,110,253,0.1)",
              }}
            >
              <Inbox className="text-primary" size={28} />
            </div>

            <h6 className="fw-semibold mb-0">No Pending Requests</h6>

            <p className="text-muted small mb-0" style={{ maxWidth: 360 }}>
              When a company requests to onboard your services, it will appear
              here for your approval.
            </p>
          </div>
        </div>
      </>
    );
  }

  /* ---------------- LIST ---------------- */
  return (
    <>
      <h5 className="fw-bold mb-3">Company Onboard Requests</h5>

      {requests.map((r) => (
        <div key={r.id} className="vendor-card card border-0 mb-3 p-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-semibold">{r.company_name}</div>
              <div className="text-muted small">
                <MapPin className="text-primary" size={14} /> {r.branch_name} •{" "}
                {r.building} • {r.floor}
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-success btn-sm"
                title="Approve"
                onClick={() => handleApprove(r.id)}
              >
                <Check size={16} />
              </button>

              <button
                className="btn btn-danger btn-sm"
                title="Reject"
                onClick={() => openRejectModal(r)}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* ---------------- REJECT MODAL ---------------- */}
      {showRejectModal && (
        <>
          <div className="modal-backdrop fade show" />

          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 rounded-4">
                <div className="modal-header">
                  <h5 className="fw-bold">Reject Request</h5>
                  <button className="btn-close" onClick={closeRejectModal} />
                </div>

                <div className="modal-body">
                  {modalError && (
                    <div className="alert alert-danger py-2 small">
                      {modalError}
                    </div>
                  )}

                  {modalSuccess && (
                    <div className="alert alert-success py-2 small">
                      {modalSuccess}
                    </div>
                  )}

                  <label className="form-label">
                    Rejection Reason <span className="text-danger">*</span>
                  </label>

                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Enter reason for rejection"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-light btn-sm"
                    onClick={closeRejectModal}
                    disabled={submitting}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    disabled={!rejectionReason.trim() || submitting}
                    onClick={submitRejection}
                  >
                    {submitting ? "Submitting..." : "Reject"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
