// src/pages/worker/TodayOrders.jsx
import { useEffect, useState } from "react";
import { fetchTodayOrders, updateOrderStatus } from "../../api/worker";
import { CreditCard, Check, Loader2, Clock } from "lucide-react";

export default function TodayOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchTodayOrders();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    setUpdating((prev) => ({ ...prev, [id]: true }));
    try {
      await updateOrderStatus(id);
      loadOrders();
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  const statusColors = {
    PAYMENT_PENDING: "secondary",
    CONFIRMED: "primary",
    PREPARING: "warning",
    READY: "info",
    COMPLETED: "success",
    FAILED: "danger",
    CANCELLED: "dark",
  };

  const buttonColors = {
    CONFIRMED: "success",
    PREPARING: "primary",
  };

  const buttonText = {
    CONFIRMED: "Start Preparing",
    PREPARING: "Mark Ready",
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">Today's Orders</h3>

      {loading ? (
        <div className="text-center py-5">
          <Loader2 className="spin" size={36} />
          <p className="mt-2">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-muted">No orders for today.</p>
      ) : (
        orders.map((o) => (
          <div
            key={o.id}
            className="card mb-3 shadow-sm border-0 rounded-3"
            style={{ background: "#f8f9fc" }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">
                  <span className="text-muted">#{o.id}</span> - {o.customer}
                </h5>

                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted small d-flex align-items-center gap-1">
                    <Clock size={14} /> {formatTime(o.created_at)}
                  </span>
                  <span
                    className={`badge bg-${
                      statusColors[o.status]
                    } text-uppercase`}
                    style={{
                      fontSize: "0.75rem",
                      minWidth: "80px",
                      textAlign: "center",
                    }}
                  >
                    {o.status}
                  </span>
                </div>
              </div>

              <ul className="list-group list-group-flush mb-3">
                {o.items.map((i, idx) => (
                  <li
                    key={idx}
                    className="list-group-item d-flex justify-content-between align-items-center px-0 py-1 border-0"
                    style={{ background: "transparent" }}
                  >
                    {i.name}
                    <span className="badge bg-secondary rounded-pill">
                      {i.qty}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="d-flex justify-content-between align-items-center mt-2">
                <p className="mb-0 fw-semibold d-flex align-items-center gap-1">
                  <CreditCard size={16} /> ₹{o.total.toFixed(2)}
                </p>

                {["CONFIRMED", "PREPARING"].includes(o.status) && (
                  <button
                    onClick={() => handleUpdate(o.id)}
                    className={`btn btn-sm btn-${
                      buttonColors[o.status]
                    } d-flex align-items-center gap-1`}
                    disabled={updating[o.id]}
                  >
                    {updating[o.id] ? (
                      <Loader2 className="spin" size={16} />
                    ) : (
                      <>
                        <Check size={16} /> {buttonText[o.status]}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
