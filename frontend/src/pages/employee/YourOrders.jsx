import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Clock, ArrowLeft, Loader2 } from "lucide-react";
import FeedbackModal from "../../components/FeedbackModal";
import { getMyOrders, cancelOrder, submitFeedback } from "../../api/order";

export default function YourOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [feedbackOrder, setFeedbackOrder] = useState(null);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelResult, setCancelResult] = useState(null); // <-- Modal message

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const PAGE_SIZE = 5;

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // ------------------ Load Orders ------------------
  const loadOrders = async (pageNo = 1) => {
    setLoadingOrders(true);
    try {
      const r = await getMyOrders({ page: pageNo, page_size: PAGE_SIZE });
      setOrders(r.data.results || []);
      setCount(r.data.count || 0);

      const totalPages = Math.ceil(r.data.count / PAGE_SIZE);
      if (pageNo > totalPages && totalPages > 0) setPage(totalPages);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadOrders(page);
  }, [page]);

  // ------------------ Feedback ------------------
  const handleSubmitFeedback = async (data) => {
    if (!feedbackOrder) return;
    setActionLoading(true);
    try {
      await submitFeedback(feedbackOrder.id, data);
      setFeedbackOrder(null);
      loadOrders(page);
    } finally {
      setActionLoading(false);
    }
  };

  // ------------------ Cancel Order ------------------
  const handleCancel = async () => {
    if (!cancelOrderId) return;
    setActionLoading(true);

    try {
      const res = await cancelOrder(cancelOrderId);

      const { success, message } = res.data; // ✅ FIX

      setCancelResult({
        success,
        message,
      });

      if (success) {
        loadOrders(page);
      }

      setCancelOrderId(null);
    } catch (err) {
      console.error(err);
      setCancelResult({
        success: false,
        message: "Failed to cancel order. Try again.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const badgeClass = (status) => {
    const map = {
      PAYMENT_PENDING: "bg-warning",
      CONFIRMED: "bg-primary",
      PREPARING: "bg-info",
      READY: "bg-success",
      COMPLETED: "bg-secondary",
      CANCELLED: "bg-danger",
    };
    return `badge ${map[status]} d-flex align-items-center gap-1`;
  };

  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <div className="container mt-4">
      {/* Header */}
      <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <ArrowLeft
          role="button"
          onClick={() => navigate(-1)}
          className="cursor-pointer"
        />
        <Package /> Your Orders
      </h4>

      {/* Loading / Empty */}
      {loadingOrders ? (
        <div className="d-flex justify-content-center py-5">
          <Loader2 className="spin" size={28} />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-muted py-5">No orders found.</div>
      ) : (
        orders.map((o) => (
          <div
            key={o.id}
            className="card shadow-sm mb-3 rounded-4 hover-shadow transition"
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">Order #{o.id}</div>
                  <small className="text-muted">
                    {new Date(o.created_at).toLocaleString()}
                  </small>
                </div>

                <div className="d-flex gap-2 align-items-center">
                  <span className={badgeClass(o.status)}>
                    <Clock size={14} /> {o.status.replace("_", " ")}
                  </span>

                  {["READY", "COMPLETED"].includes(o.status) && !o.feedback && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setFeedbackOrder(o)}
                    >
                      ⭐ Rate Order
                    </button>
                  )}

                  {o.status === "CONFIRMED" && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setCancelOrderId(o.id)}
                      disabled={actionLoading && cancelOrderId === o.id}
                    >
                      {actionLoading && cancelOrderId === o.id ? (
                        <Loader2 className="spin" size={16} />
                      ) : (
                        "Cancel Order"
                      )}
                    </button>
                  )}
                </div>
              </div>

              <hr />

              {o.items.map((i, idx) => (
                <div key={idx} className="d-flex justify-content-between">
                  <small>
                    {i.qty} × {i.name}
                  </small>
                  <small>₹{i.price * i.qty}</small>
                </div>
              ))}

              {o.feedback && (
                <div className="mt-3">
                  <strong>Your Rating:</strong> {"⭐".repeat(o.feedback.rating)}
                  <div className="text-muted small">{o.feedback.comment}</div>
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-4">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page === 1 || loadingOrders}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </button>

          <span className="align-self-center small">
            Page {page} of {totalPages}
          </span>

          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page === totalPages || loadingOrders}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          >
            Next
          </button>
        </div>
      )}

      {/* ---------------- Feedback Modal ---------------- */}
      {feedbackOrder && feedbackOrder.id && (
        <FeedbackModal
          show={true}
          orderId={feedbackOrder.id}
          onClose={() => setFeedbackOrder(null)}
          onSubmit={handleSubmitFeedback}
          loading={actionLoading}
        />
      )}

      {/* ---------------- Cancel Confirmation Modal ---------------- */}
      {cancelOrderId && (
        <>
          <div className="modal-backdrop fade show" />
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 rounded-4 shadow-lg">
                <div className="modal-header">
                  <h5 className="fw-bold">Cancel Order</h5>
                  <button
                    className="btn-close"
                    onClick={() => setCancelOrderId(null)}
                  />
                </div>
                <div className="modal-body">
                  Are you sure you want to cancel this order?
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-light btn-sm"
                    onClick={() => setCancelOrderId(null)}
                    disabled={actionLoading}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleCancel}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Cancelling..." : "Confirm Cancel"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ---------------- Cancel Result Modal ---------------- */}
      {cancelResult && (
        <>
          <div className="modal-backdrop fade show" />
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 rounded-4 shadow-lg">
                <div className="modal-header">
                  <h5 className="fw-bold">
                    {cancelResult.success ? "Success" : "Failed"}
                  </h5>
                  <button
                    className="btn-close"
                    onClick={() => setCancelResult(null)}
                  />
                </div>
                <div className="modal-body">{cancelResult.message}</div>
                <div className="modal-footer">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setCancelResult(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
