import { useEffect, useState } from "react";
import {
  getCart,
  removeFromCart,
  updateCartQty,
  verifyPayment,
} from "../../api/order";
import { createOrder } from "../../api/order";
import {
  ShoppingCart,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
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

  const loadCart = () => getCart().then((r) => setCart(r.data.items));

  useEffect(() => {
    loadCart();
  }, []);

  const toggleSelect = (item) => {
    setSelected((prev) =>
      prev.find((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };

  const toggleSelectAll = () => {
    setSelected(selected.length === cart.length ? [] : [...cart]);
  };

  const updateQty = async (item, type) => {
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

  const handlePlaceOrder = async () => {
    if (!selected.length) return;

    setPlacingOrder(true);
    setError("");

    try {
      const cart_item_ids = selected.map((i) => i.id);

      const res = await createOrder({ cart_item_ids });

      const options = {
        key: res.data.razorpay_key,
        amount: res.data.amount, // ⚠️ DO NOT multiply
        currency: "INR",
        name: "Cafetero",
        description: "Food Order",
        order_id: res.data.razorpay_order_id,

        prefill: {
          name: res.data.user?.name || "Customer",
          email: res.data.user?.email || "customer@test.com",
          contact: res.data.user?.phone || "9999999999",
        },

        theme: {
          color: "#0d6efd",
        },

        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay using UPI",
                instruments: [{ method: "upi" }],
              },
              card: {
                name: "Pay using Card",
                instruments: [{ method: "card" }],
              },
              wallet: {
                name: "Pay using Wallet",
                instruments: [{ method: "wallet" }],
              },
              netbanking: {
                name: "Pay using Net Banking",
                instruments: [{ method: "netbanking" }],
              },
            },
            sequence: [
              "block.upi",
              "block.card",
              "block.wallet",
              "block.netbanking",
            ],
            preferences: {
              show_default_blocks: false,
            },
          },
        },

        handler: async function (response) {
          await verifyPayment(response);
          setOrderSuccess(true);
        },

        modal: {
          ondismiss: () => setPlacingOrder(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      setError("Unable to start payment.");
      console.log("ERRROR: ", e);
      setPlacingOrder(false);
    }
  };

  const totalPrice = selected.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="container mt-4">
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

      {cart.length > 0 && (
        <div className="mb-2">
          <input
            type="checkbox"
            checked={selected.length === cart.length}
            onChange={toggleSelectAll}
          />{" "}
          <small className="fw-semibold">All</small>
        </div>
      )}

      {cart.map((c) => (
        <div key={c.id} className="p-3 mb-2 rounded-3 shadow-sm bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <input
                type="checkbox"
                checked={!!selected.find((i) => i.id === c.id)}
                onChange={() => toggleSelect(c)}
              />
              <div>
                <div className="fw-semibold">{c.name}</div>
                <small className="text-muted">₹{c.price}</small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-sm btn-light"
                onClick={() => updateQty(c, "dec")}
                disabled={loadingAction[`${c.id}-dec`]}
              >
                {loadingAction[`${c.id}-dec`] ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <Minus size={14} />
                )}
              </button>

              <span>{c.quantity}</span>

              <button
                className="btn btn-sm btn-light"
                onClick={() => updateQty(c, "inc")}
                disabled={loadingAction[`${c.id}-inc`]}
              >
                {loadingAction[`${c.id}-inc`] ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <Plus size={14} />
                )}
              </button>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => removeItem(c.id)}
                disabled={loadingAction[`${c.id}-del`]}
              >
                {loadingAction[`${c.id}-del`] ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}

      {error && <div className="alert alert-danger">{error}</div>}

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
            {placingOrder ? "Processing..." : <CheckCircle2 size={18} />} Place
            Order
          </button>
        </div>
      )}

      {/* PROCESSING MODAL */}
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

      {/* SUCCESS MODAL */}
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
                Track Your Order →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
