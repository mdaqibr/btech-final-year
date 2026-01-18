import { useEffect, useState } from "react";
import {
  getCart,
  removeFromCart,
  updateCartQty,
  verifyPayment,
  createOrder,
} from "../../api/order";
import {
  ShoppingCart,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function YourCart() {
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loadingAction, setLoadingAction] = useState({});
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadCart = async () => {
    const r = await getCart();
    setCart(r.data.items);
  };

  useEffect(() => {
    loadCart();
  }, []);

  /* ----------------- Selection Logic ----------------- */

  const toggleSelect = (item) => {
    if (!item.is_available) return;

    setError("");
    setSelected((prev) =>
      prev.find((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };

  const toggleSelectAll = () => {
    setError("");
    const availableItems = cart.filter((i) => i.is_available);
    setSelected(
      selected.length === availableItems.length ? [] : availableItems
    );
  };

  /* ----------------- Cart Actions ----------------- */

  const updateQty = async (item, type) => {
    if (!item.is_available) return;

    setLoadingAction((p) => ({ ...p, [`${item.id}-${type}`]: true }));
    const newQty =
      type === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1);

    try {
      await updateCartQty(item.id, newQty);
      await loadCart();
    } finally {
      setLoadingAction((p) => ({ ...p, [`${item.id}-${type}`]: false }));
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm("Remove this item?")) return;

    setLoadingAction((p) => ({ ...p, [`${id}-del`]: true }));
    try {
      await removeFromCart(id);
      setSelected((prev) => prev.filter((i) => i.id !== id));
      await loadCart();
    } finally {
      setLoadingAction((p) => ({ ...p, [`${id}-del`]: false }));
    }
  };

  /* ----------------- Order ----------------- */

  const handlePlaceOrder = async () => {
    if (!selected.length) return;

    setPlacingOrder(true);
    setError("");

    try {
      const cart_item_ids = selected.map((i) => i.id);
      const res = await createOrder({ cart_item_ids });

      const options = {
        key: res.data.razorpay_key,
        amount: res.data.amount,
        currency: "INR",
        name: "Cafetero",
        description: "Food Order",
        order_id: res.data.razorpay_order_id,

        prefill: {
          name: res.data.user?.name || "Customer",
          email: res.data.user?.email || "customer@test.com",
          contact: res.data.user?.phone || "9999999999",
        },

        theme: { color: "#0d6efd" },

        handler: async function (response) {
          await verifyPayment(response);

          // ✅ IMPORTANT FIX
          setPlacingOrder(false);
          setOrderSuccess(true);
        },

        modal: {
          ondismiss: () => setPlacingOrder(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.non_field_errors?.[0] ||
        "Some selected items are unavailable";

      setError(msg);
      await loadCart();
      setPlacingOrder(false);
    }
  };

  /* ----------------- Derived ----------------- */

  const totalPrice = selected.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  );

  const availableCount = cart.filter((i) => i.is_available).length;

  /* ----------------- UI ----------------- */

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <button
          className="btn btn-light rounded-circle shadow-sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
        </button>
        <ShoppingCart size={22} />
        <h4 className="fw-bold m-0">Your Cart</h4>
      </div>

      {availableCount > 0 && (
        <div className="mb-2">
          <input
            type="checkbox"
            checked={selected.length === availableCount}
            onChange={toggleSelectAll}
          />{" "}
          <small className="fw-semibold">All Available</small>
        </div>
      )}

      {cart.map((c) => (
        <div
          key={c.id}
          className={`p-3 mb-2 rounded-3 shadow-sm ${
            c.is_available ? "bg-light" : "bg-secondary bg-opacity-10"
          }`}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <input
                type="checkbox"
                disabled={!c.is_available}
                checked={!!selected.find((i) => i.id === c.id)}
                onChange={() => toggleSelect(c)}
              />

              <div>
                <div className="fw-semibold d-flex align-items-center gap-2">
                  {c.name}
                  {c.is_available ? (
                    <span className="badge bg-success d-flex gap-1">
                      <CheckCircle2 size={12} /> Available
                    </span>
                  ) : (
                    <span className="badge bg-danger d-flex gap-1">
                      <XCircle size={12} /> Unavailable
                    </span>
                  )}
                </div>
                <small className="text-muted">₹{c.price}</small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-sm btn-light"
                disabled={!c.is_available}
                onClick={() => updateQty(c, "dec")}
              >
                <Minus size={14} />
              </button>

              <span>{c.quantity}</span>

              <button
                className="btn btn-sm btn-light"
                disabled={!c.is_available}
                onClick={() => updateQty(c, "inc")}
              >
                <Plus size={14} />
              </button>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => removeItem(c.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {error && (
        <div className="alert alert-warning d-flex align-items-center gap-2">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {selected.length > 0 && (
        <div className="mt-4 p-3 bg-primary text-white rounded-3 d-flex justify-content-between">
          <div>
            <div>{selected.length} items selected</div>
            <small>Total: ₹{totalPrice}</small>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className="btn btn-light text-primary fw-semibold"
          >
            Place Order
          </button>
        </div>
      )}

      {/* ---------------- PROCESSING MODAL ---------------- */}
      {placingOrder && (
        <div
          className="modal fade show d-block"
          style={{ background: "#0008" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 text-center">
              <h5>Processing your order...</h5>
              <div className="spinner-border mt-3"></div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SUCCESS MODAL ---------------- */}
      {orderSuccess && (
        <div
          className="modal fade show d-block"
          style={{ background: "#0008" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 text-center">
              <h4>🎉 Order Placed Successfully!</h4>
              <button
                onClick={() => navigate("/employee/your-orders")}
                className="btn btn-success mt-3 px-4"
              >
                View Your Orders →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
