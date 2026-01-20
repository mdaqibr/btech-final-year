// src/pages/employee/FoodFeedback.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getFoodFeedback } from "../../api/order";
import { ArrowLeft, Star, MessageSquare } from "lucide-react";

export default function FoodFeedback() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [feedback, setFeedback] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  const foodName = location.state?.foodName || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  /* ---------------- Load Feedback ---------------- */
  const loadFeedback = async (pageNo = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await getFoodFeedback(itemId, pageNo);
      const data = res.data.results;

      setAvgRating(data.avg_rating);
      setTotalRatings(data.total_ratings);
      setFeedback(data.feedback);
      setHasNext(!!res.data.next);
    } catch {
      setError("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback(page);
  }, [itemId, page]);

  return (
    <div className="container-fluid px-2 px-md-4 py-3">
      {/* HEADER */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-light shadow-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h5 className="fw-bold mb-1">{foodName}</h5>
          {totalRatings > 0 && (
            <div className="d-flex align-items-center gap-1 text-muted small">
              <Star size={14} className="text-warning" />
              {avgRating.toFixed(1)} ({totalRatings} reviews)
            </div>
          )}
        </div>
      </div>

      {/* STATES */}
      {loading && (
        <div className="text-center text-muted py-5">Loading feedback...</div>
      )}

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2">
          <MessageSquare size={18} /> {error}
        </div>
      )}

      {!loading && !feedback.length && !error && (
        <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
          <MessageSquare size={48} className="mb-3" />
          <h6 className="fw-bold mb-1">No Feedback Yet</h6>
          <p className="text-center small">This food item hasn't received any feedback yet. Be the first to share your experience!</p>
        </div>
      )}

      {/* FEEDBACK LIST */}
      <div className="row g-3">
        {feedback.map((f, idx) => (
          <div key={idx} className="col-12 col-md-6">
            <div className="card shadow-sm rounded-4 p-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>{f.user}</strong>
                <span className="text-warning">
                  {"⭐".repeat(f.rating)}
                </span>
              </div>
              <div className="small text-muted mb-2">
                {new Date(f.order_time).toLocaleString()}
              </div>
              <div>{f.comment}</div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {feedback.length > 0 && (
        <div className="d-flex justify-content-between mt-4">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>

          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={!hasNext}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* ===== STYLING ===== */}
      <style>{`
        .card {
          transition: all 0.25s ease;
        }
        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }
      `}</style>
    </div>
  );
}
