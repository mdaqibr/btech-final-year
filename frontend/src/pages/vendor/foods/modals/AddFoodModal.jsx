// src / pages / vendor / foods / modals / AddFoodModal.jsx;
import { useEffect, useState } from "react";
import { createVendorFood, updateVendorFood } from "../../../../api/vendor";
import { Utensils, IndianRupee } from "lucide-react";

export default function AddFoodModal({ show, food, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "lunch",
    category: "veg",
    base_price_cents: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show && food) {
      setForm({
        ...food,
        base_price_cents: food.base_price_cents,
      });
    }
    if (show && !food) {
      setForm({
        name: "",
        description: "",
        type: "lunch",
        category: "veg",
        base_price_cents: "",
      });
    }
  }, [show, food]);

  if (!show) return null;

  const submit = () => {
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      base_price_cents: Number(form.base_price_cents),
    };

    const apiCall = food
      ? updateVendorFood(food.id, payload)
      : createVendorFood(payload);

    apiCall
      .then(() => {
        onSuccess?.();
        setTimeout(onClose, 400);
      })
      .catch(() => setError("Something went wrong"))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="modal-backdrop fade show" />

      <div className="modal fade show" style={{ display: "block" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header">
              <h5 className="fw-bold">{food ? "Edit Food" : "Add Food"}</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger py-2 small">{error}</div>
              )}

              <label className="form-label">Food Name</label>
              <div className="input-group mb-2">
                <span className="input-group-text">
                  <Utensils size={14} />
                </span>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <textarea
                className="form-control mb-2"
                placeholder="Description"
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <div className="row mb-2">
                <div className="col">
                  <select
                    className="form-select"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="evening_snacks">Evening Snacks</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </div>
                <div className="col">
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option value="veg">Veg</option>
                    <option value="non_veg">Non Veg</option>
                  </select>
                </div>
              </div>

              <label className="form-label">Price (₹)</label>
              <div className="input-group">
                <span className="input-group-text">
                  <IndianRupee size={14} />
                </span>
                <input
                  type="number"
                  className="form-control"
                  value={form.base_price_cents}
                  onChange={(e) =>
                    setForm({ ...form, base_price_cents: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-light btn-sm" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={submit}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
