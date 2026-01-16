import { useEffect, useState } from "react";
import { getMyOrders } from "../../api/order";
import { Package, Clock, CheckCircle, CookingPot } from "lucide-react";

export default function YourOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getMyOrders().then((r) => setOrders(r.data));
  }, []);

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

  const icon = (s) => {
    if (s === "PREPARING") return <CookingPot size={16} />;
    if (s === "READY") return <CheckCircle size={16} />;
    return <Clock size={16} />;
  };

  return (
    <div className="container mt-4">
      <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
        <Package /> Your Orders
      </h4>

      {orders.map((o) => (
        <div key={o.id} className="card shadow-sm mb-3 rounded-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-semibold">Order #{o.id}</div>
                <small className="text-muted">
                  {new Date(o.created_at).toLocaleString()}
                </small>
              </div>

              <span className={badge(o.status)}>
                {icon(o.status)} {o.status.replace("_", " ")}
              </span>
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

            <div className="text-end fw-bold mt-2">Total: ₹{o.total}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
