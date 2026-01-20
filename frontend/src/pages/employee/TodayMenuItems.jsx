// src/pages/employee/TodayMenuItems.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeTodayMenu } from "../../api/employee";
import { addToCart, getCart, getFoodFeedback } from "../../api/order";
import { Plus, Minus, ArrowLeft, ArrowRight, Search, ShoppingCart, Star, AlertTriangle, Coffee } from "lucide-react";

export default function TodayMenuItems() {
  const { floorId, vendorBranchId, foodType } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [ratings, setRatings] = useState({});
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [error, setError] = useState("");

  /* ---------------- Fetch Menu ---------------- */
  const loadMenu = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getEmployeeTodayMenu(floorId, vendorBranchId, foodType, searchText);
      const menuItems = res.data.map((item) => ({ ...item, qty: 1 }));
      setItems(menuItems);
      fetchRatings(menuItems);
    } catch {
      setError("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Fetch Ratings ---------------- */
  const fetchRatings = async (menuItems) => {
    const ratingMap = {};
    await Promise.all(
      menuItems.map(async (item) => {
        try {
          const res = await getFoodFeedback(item.id, 1, 1);
          const data = res.data.results;
          ratingMap[item.id] = {
            avg_rating: data.avg_rating || 0,
            total_ratings: data.total_ratings || 0,
          };
        } catch {
          ratingMap[item.id] = { avg_rating: 0, total_ratings: 0 };
        }
      })
    );
    setRatings(ratingMap);
  };

  useEffect(() => {
    loadMenu();
  }, [floorId, vendorBranchId, foodType, searchText]);

  /* ---------------- Fetch Cart ---------------- */
  const refreshCart = async () => {
    try {
      const res = await getCart();
      const total = res.data.items.reduce((acc, i) => acc + i.quantity, 0);
      setCartCount(total);
    } catch {}
  };

  useEffect(() => {
    refreshCart();
  }, []);

  /* ---------------- Helpers ---------------- */
  const humanize = (str) => str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const incrementQty = (id) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  };

  const decrementQty = (id) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i)));
  };

  const handleAddToCart = async (item) => {
    setError("");
    try {
      await addToCart(item.id, item.qty);
      refreshCart();
    } catch (e) {
      const msg = e?.response?.data?.detail || "This item is no longer available";
      setError(msg);
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_available: false } : i)));
    }
  };

  return (
    <div className="container-fluid px-2 px-md-4 py-3">
      {/* HEADER + SEARCH + CART */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-center gap-3 w-100">
          <button className="btn btn-light shadow-sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h5 className="fw-bold mb-1">{humanize(foodType)}</h5>
            <small className="text-muted d-block">Select items to order</small>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 w-100 w-md-auto">
          {/* Search */}
          <div className="input-group">
            <span className="input-group-text bg-white">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search items..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* Cart */}
          <button
            className="btn btn-light position-relative"
            onClick={() => navigate("/employee/your-cart")}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="alert alert-warning d-flex align-items-center gap-2">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {/* MENU ITEMS */}
      <div className="row g-4">
        {loading ? (
          <div className="text-center text-muted py-5">Loading menu...</div>
        ) : items.length ? (
          items.map((i) => {
            const rating = ratings[i.id];
            const avg = rating?.avg_rating || 0;
            const count = rating?.total_ratings || 0;

            return (
              <div key={i.id} className="col-12 col-sm-6 col-lg-4">
                <div className="card h-100 shadow-sm rounded-4 overflow-hidden position-relative menu-item-card p-3">
                  {/* ACCENT STRIP */}
                  <div className="position-absolute top-0 start-0 w-100 border-top border-4 border-primary"></div>

                  {/* TITLE + RATING */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold mb-0">{i.name}</h6>
                    <div className="d-flex align-items-center gap-1">
                      <Star size={14} className="text-warning" />
                      <span className="fw-semibold">{count > 0 ? avg.toFixed(1) : "New"}</span>
                      {count > 0 && <small className="text-muted">({count})</small>}
                    </div>
                  </div>

                  <p className="text-muted small mb-3">{i.description}</p>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <strong>₹{i.price_cents}</strong>
                    <div className="d-flex gap-2 align-items-center">
                      <button className="btn btn-light btn-sm" onClick={() => decrementQty(i.id)}>
                        <Minus size={14} />
                      </button>
                      <span>{i.qty}</span>
                      <button className="btn btn-light btn-sm" onClick={() => incrementQty(i.id)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <button
                    className="btn btn-success btn-sm w-100 mb-2"
                    disabled={!i.is_available}
                    onClick={() => handleAddToCart(i)}
                  >
                    Add to Cart
                  </button>

                  {/* SEE FEEDBACK */}
                  <div
                    className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/employee/${i.id}/feedback`, { state: { foodName: i.name } })}
                  >
                    <span className="text-primary fw-semibold">
                      See Feedback {count > 0 && <span className="text-muted">({count})</span>}
                    </span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted w-100">
            <Coffee size={48} className="mb-3" />
            <h6 className="fw-bold mb-1">No Items Available</h6>
            <p className="text-center small">Currently, there are no menu items for this category.</p>
          </div>
        )}
      </div>

      {/* CART CTA */}
      <div
        className="d-flex flex-column align-items-center justify-content-center mt-5 p-4 shadow-sm rounded-4"
        style={{ backgroundColor: "#e7f1ff" }}
      >
        <ShoppingCart size={32} style={{ color: "#0d6efd", marginBottom: "1rem" }} />
        <h6 style={{ fontWeight: 600, color: "#0d6efd", marginBottom: "0.75rem" }}>
          Ready to Order?
        </h6>
        <p style={{ color: "#6c757d", marginBottom: "1.5rem" }}>Check your cart anytime</p>
        <button
          onClick={() => navigate(`/employee/your-cart`)}
          style={{
            border: "none",
            borderRadius: "0.75rem",
            backgroundColor: "#0d6efd",
            color: "#fff",
            padding: "0.75rem 2rem",
            fontWeight: 600,
            margin: "0 0.5rem",
            boxShadow: "0 0.25rem 0.75rem rgba(13,110,253,0.3)",
          }}
        >
          View Cart
        </button>
      </div>

      {/* ===== STYLING ===== */}
      <style>{`
        .menu-item-card {
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .menu-item-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }
        .input-group .form-control {
          min-width: 150px;
        }
      `}</style>
    </div>
  );
}
