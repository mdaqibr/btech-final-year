// src/components/FeedbackModal.jsx
import { useState } from "react";
import { Star } from "lucide-react";

export default function FeedbackModal({ orderId, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show" style={{ opacity: 0.5 }} />

      {/* Modal */}
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4">
            <div className="modal-body">
              <h5 className="fw-bold">Rate your order</h5>

              <div className="d-flex gap-2 my-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={28}
                    className={i <= rating ? "text-warning" : "text-muted"}
                    onClick={() => setRating(i)}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </div>

              <textarea
                className="form-control"
                placeholder="Optional comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button
                className="btn btn-success w-100 mt-3"
                disabled={!rating}
                onClick={() => onSubmit({ rating, comment })}
              >
                Submit Feedback
              </button>

              <button
                className="btn btn-light w-100 mt-2"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}