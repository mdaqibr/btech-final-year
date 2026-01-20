// src/pages/employee/TodayMenuItems.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeTodayMenu } from "../../api/employee";
import { addToCart, getCart, getFoodFeedback } from "../../api/order";
import {
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Search,
  X,
  ShoppingCart,
  AlertTriangle,
  Star,
} from "lucide-react";

export default function TodayMenuItems() {
  const { floorId, vendorBranchId, foodType } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [ratings, setRatings] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [error, setError] = useState("");

  /* ---------------- Fetch Menu ---------------- */
  const loadMenu = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getEmployeeTodayMenu(
        floorId,
        vendorBranchId,
        foodType,
        search
      );

      const menuItems = res.data.map((item) => ({
        ...item,
        qty: 1,
      }));

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
          ratingMap[item.id] = {
            avg_rating: 0,
            total_ratings: 0,
          };
        }
      })
    );

    setRatings(ratingMap);
  };

  useEffect(() => {
    loadMenu();
  }, [floorId, vendorBranchId, foodType, search]);

  /* ---------------- Fetch Cart ---------------- */
  const refreshCart = async () => {
    try {
      const res = await getCart();
      const total = res.data.items.reduce(
        (acc, i) => acc + i.quantity,
        0
      );
      setCartCount(total);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  /* ---------------- Helpers ---------------- */
  const humanize = (str) =>
    str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const incrementQty = (id) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: i.qty + 1 } : i
      )
    );
  };

  const decrementQty = (id) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, qty: Math.max(1, i.qty - 1) }
          : i
      )
    );
  };

  /* ---------------- Add to Cart ---------------- */
  const handleAddToCart = async (item) => {
    setError("");
    try {
      await addToCart(item.id, item.qty);
      refreshCart();
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        "This item is no longer available";

      setError(msg);

      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, is_available: false }
            : i
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
            <h5 className="fw-bold mb-0">
              {humanize(foodType)}
            </h5>
            <small className="text-muted">
              Select items to order
            </small>
          </div>
        </div>

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

      {/* ITEMS */}
      <div className="row g-3">
        {loading ? (
          <div className="text-center text-muted">
            Loading menu...
          </div>
        ) : items.length ? (
          items.map((i) => {
            const rating = ratings[i.id];
            const avg = rating?.avg_rating || 0;
            const count = rating?.total_ratings || 0;

            return (
              <div key={i.id} className="col-md-6 col-lg-4">
                <div className="card shadow-sm p-3 h-100">
                  {/* TITLE + RATING */}
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold mb-0">{i.name}</h6>

                    <div className="d-flex align-items-center gap-1">
                      <Star size={14} className="text-warning" />
                      <span className="fw-semibold">
                        {count > 0 ? avg.toFixed(1) : "New"}
                      </span>
                      {count > 0 && (
                        <small className="text-muted">
                          ({count})
                        </small>
                      )}
                    </div>
                  </div>

                  <p className="text-muted small mt-2">
                    {i.description}
                  </p>

                  <div className="d-flex justify-content-between align-items-center">
                    <strong>₹{i.price_cents}</strong>

                    <div className="d-flex gap-2 align-items-center">
                      <button
                        className="btn btn-light btn-sm"
                        onClick={() => decrementQty(i.id)}
                      >
                        <Minus size={14} />
                      </button>

                      <span>{i.qty}</span>

                      <button
                        className="btn btn-light btn-sm"
                        onClick={() => incrementQty(i.id)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <button
                    className="btn btn-success btn-sm mt-3"
                    disabled={!i.is_available}
                    onClick={() => handleAddToCart(i)}
                  >
                    Add to Cart
                  </button>

                  {/* SEE FEEDBACK (ONLY ADDITION) */}
                  <div
                    className="d-flex justify-content-between align-items-center mt-3 p-2 border-top"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/employee/${i.id}/feedback`, {
                        state: { foodName: i.name },
                      })
                    }
                  >
                    <span className="text-primary fw-semibold">
                      See Feedback
                      {count > 0 && (
                        <span className="text-muted ms-1">
                          ({count})
                        </span>
                      )}
                    </span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-muted">
            No items found
          </div>
        )}
      </div>
    </>
  );
}
