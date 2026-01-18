// src/pages/employee/TodayMenuItems.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeTodayMenu } from "../../api/employee";
import { addToCart, getCart } from "../../api/order";
import {
  Plus,
  Minus,
  ArrowLeft,
  Search,
  X,
  ShoppingCart,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function TodayMenuItems() {
  const { floorId, vendorBranchId, foodType } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [error, setError] = useState("");

  /* ---------------- Fetch Menu ---------------- */

  useEffect(() => {
    setLoading(true);
    getEmployeeTodayMenu(floorId, vendorBranchId, foodType, search)
      .then((r) => {
        const dataWithQty = r.data.map((item) => ({
          ...item,
          qty: item.qty || 1,
        }));
        setItems(dataWithQty);
      })
      .finally(() => setLoading(false));
  }, [floorId, vendorBranchId, foodType, search]);

  /* ---------------- Fetch Cart Count ---------------- */

  useEffect(() => {
    getCart().then((r) => {
      const total = r.data.items.reduce((acc, i) => acc + i.quantity, 0);
      setCartCount(total);
    });
  }, []);

  /* ---------------- Helpers ---------------- */

  const humanize = (str) =>
    str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const incrementQty = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decrementQty = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: item.qty > 1 ? item.qty - 1 : 1 }
          : item
      )
    );
  };

  /* ---------------- Add to Cart ---------------- */

  const handleAddToCart = async (item) => {
    setError("");

    try {
      await addToCart(item.id, item.qty);
      setCartCount((prev) => prev + item.qty);
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        "This item is no longer available";

      setError(msg);

      // 🔥 Mark item unavailable locally (UX improvement)
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, is_available: false } : i
        )
      );
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      {/* HEADER */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-light shadow-sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h5 className="fw-bold mb-0">{humanize(foodType)}</h5>
            <small className="text-muted">Select items to order</small>
          </div>
        </div>

        {/* CART ICON */}
        <button
          className="btn btn-light position-relative"
          onClick={() => navigate("/employee/your-cart")}
        >
          <ShoppingCart size={18} />
          {cartCount > 0 && (
            <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="alert alert-warning d-flex align-items-center gap-2">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {/* SEARCH */}
      <div className="mb-4">
        <div className="input-group shadow-sm">
          <span className="input-group-text bg-white border-0">
            <Search size={18} className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control border-0"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="btn btn-light border-0"
              onClick={() => setSearch("")}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* MENU ITEMS */}
      <div className="row g-3">
        {loading ? (
          <div className="text-center text-muted mt-4">Loading...</div>
        ) : items.length ? (
          items.map((i) => (
            <div key={i.id} className="col-md-6 col-lg-4">
              <div
                className={`card border-0 shadow-sm p-3 h-100 ${
                  !i.is_available ? "opacity-75" : ""
                }`}
              >
                <div className="d-flex justify-content-between">
                  <h6 className="fw-bold">{i.name}</h6>
                  {i.is_available ? (
                    <span className="badge bg-success d-flex gap-1">
                      <CheckCircle2 size={12} /> Available
                    </span>
                  ) : (
                    <span className="badge bg-danger d-flex gap-1">
                      <XCircle size={12} /> Unavailable
                    </span>
                  )}
                </div>

                <p className="small text-muted mb-2">{i.description}</p>

                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <span className="fw-semibold">₹{i.price_cents}</span>

                  <div className="d-flex gap-2 align-items-center">
                    <button
                      className="btn btn-light btn-sm"
                      disabled={!i.is_available}
                      onClick={() => decrementQty(i.id)}
                    >
                      <Minus size={14} />
                    </button>

                    <span className="fw-semibold">{i.qty}</span>

                    <button
                      className="btn btn-light btn-sm"
                      disabled={!i.is_available}
                      onClick={() => incrementQty(i.id)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <button
                  className="btn btn-success btn-sm mt-3 w-100"
                  disabled={!i.is_available}
                  onClick={() => handleAddToCart(i)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted mt-4">No items found 😕</div>
        )}
      </div>
    </>
  );
}
