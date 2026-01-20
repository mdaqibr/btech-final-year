// src/pages/employee/FoodFeedback.jsx
import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { getFoodFeedback } from "../../api/order";
import { ArrowLeft, Star } from "lucide-react";

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
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <button
          className="btn btn-light"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
        </button>

        <div>
          <h5 className="fw-bold mb-0">{foodName}</h5>
          {totalRatings > 0 && (
            <div className="text-muted small d-flex align-items-center gap-1">
              <Star size={14} className="text-warning" />
              {avgRating} ({totalRatings} reviews)
            </div>
          )}
        </div>
      </div>

      {/* STATES */}
      {loading && (
        <div className="text-center text-muted">
          Loading feedback...
        </div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {!loading && !feedback.length && (
        <div className="text-muted">
          No feedback yet for this food
        </div>
      )}

      {/* FEEDBACK LIST */}
      {feedback.map((f, idx) => (
        <div
          key={idx}
          className="border rounded p-3 mb-2"
        >
          <div className="d-flex justify-content-between">
            <strong>{f.user}</strong>
            <span className="text-warning">
              {"⭐".repeat(f.rating)}
            </span>
          </div>

          <div className="small text-muted">
            {new Date(f.order_time).toLocaleString()}
          </div>

          <div className="mt-1">{f.comment}</div>
        </div>
      ))}

      {/* PAGINATION */}
      {feedback.length > 0 && (
        <div className="d-flex justify-content-between mt-3">
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
    </div>
  );
}
