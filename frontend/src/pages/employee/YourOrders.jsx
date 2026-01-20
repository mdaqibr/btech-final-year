import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeedbackModal from "../../components/FeedbackModal";
import { getMyOrders, cancelOrder, submitFeedback } from "../../api/order";
import {
  Package,
  Clock,
  ArrowLeft,
} from "lucide-react";

export default function YourOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [feedbackOrder, setFeedbackOrder] = useState(null);

  // pagination state
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const PAGE_SIZE = 5;

  const loadOrders = async (pageNo = 1) => {
    const r = await getMyOrders({ page: pageNo });
    setOrders(r.data.results);
    setCount(r.data.count);
  };

  useEffect(() => {
    loadOrders(page);
  }, [page]);

  const handleSubmitFeedback = async (data) => {
    await submitFeedback(feedbackOrder.id, data);
    setFeedbackOrder(null);
    loadOrders(page);
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    await cancelOrder(orderId);
    loadOrders(page);
  };

  const badge = (s) => {
    const map = {
      PAYMENT_PENDING: "bg-warning",
      CONFIRMED: "bg-primary",
      PREPARING: "bg-info",
      READY: "bg-success",
      COMPLETED: "bg-secondary",
      CANCELLED: "bg-danger",
    };
    return `badge ${map[s]}`;
  };

  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <div className="container mt-4">
      {/* Header */}
      <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
        <ArrowLeft
          role="button"
          onClick={() => navigate(-1)}
        />
        <Package /> Your Orders
      </h4>

      {orders.map((o) => (
        <div key={o.id} className="card shadow-sm mb-3 rounded-4">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <div className="fw-semibold">Order #{o.id}</div>
                <small className="text-muted">
                  {new Date(o.created_at).toLocaleString()}
                </small>
              </div>

              <div className="d-flex gap-2 align-items-center">
                <span className={badge(o.status)}>
                  <Clock size={14} /> {o.status.replace("_", " ")}
                </span>

                {["READY", "COMPLETED"].includes(o.status) &&
                  !o.feedback && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setFeedbackOrder(o)}
                    >
                      ⭐ Rate Order
                    </button>
                  )}
              </div>
            </div>

            <hr />

            {o.items.map((i, idx) => (
              <div key={idx} className="d-flex justify-content-between">
                <small>{i.qty} × {i.name}</small>
                <small>₹{i.price * i.qty}</small>
              </div>
            ))}

            {o.feedback && (
              <div className="mt-3">
                <strong>Your Rating:</strong>{" "}
                {"⭐".repeat(o.feedback.rating)}
                <div className="text-muted small">{o.feedback.comment}</div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-4">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>

          <span className="align-self-center small">
            Page {page} of {totalPages}
          </span>

          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {feedbackOrder && (
        <FeedbackModal
          orderId={feedbackOrder.id}
          onClose={() => setFeedbackOrder(null)}
          onSubmit={handleSubmitFeedback}
        />
      )}
    </div>
  );
}
