import { useEffect, useState } from "react";
import { IndianRupee, AlertCircle, CheckCircle } from "lucide-react";
import { assignFoodToFloor, updateFloorFood } from "../../../../api/vendor";

export default function AddFloorFoodModal({
  floorId,
  floorFood,
  branchFoods,
  assignedFoods,
  onClose,
  onSuccess,
}) {
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState({
    floorId,
    foodId: "",
    name_override: "",
    description_override: "",
    floor_level_price_override_cents: 0,
    default_quantity: 1,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  useEffect(() => {
    if (!branchFoods) return;

    if (!floorFood) {
      // ADD MODE: only show unassigned foods
      const assignedIds = assignedFoods.map((f) => f.vendor_branch_food);
      const available = branchFoods.filter((f) => !assignedIds.includes(f.id));

      setFoods(
        available.map((f) => ({
          id: f.id,
          name: f.food_name || `Food #${f.id}`,
          description: f.description || "",
          base_price_cents:
            f.branch_level_price_override_cents ?? f.base_price_cents ?? 0,
        }))
      );
      setForm({
        floorId,
        foodId: "",
        name_override: "",
        description_override: "",
        floor_level_price_override_cents: 0,
        default_quantity: 1,
      });
    } else {
      // EDIT MODE
      setFoods([
        {
          id: floorFood.vendor_branch_food,
          name:
            floorFood.name_override ||
            floorFood.food_name ||
            `Food #${floorFood.vendor_branch_food}`,
          description:
            floorFood.description_override || floorFood.description || "",
          base_price_cents:
            floorFood.floor_level_price_override_cents ??
            floorFood.food_price_cents ??
            0,
        },
      ]);
      setForm({
        floorId,
        foodId: floorFood.vendor_branch_food,
        name_override: floorFood.name_override || "",
        description_override: floorFood.description_override || "",
        floor_level_price_override_cents:
          floorFood.floor_level_price_override_cents ??
          floorFood.food_price_cents ??
          0,
        default_quantity: floorFood.default_quantity || 1,
      });
    }
  }, [floorFood, branchFoods, assignedFoods, floorId]);

  useEffect(() => {
    // Auto-fill Name/Description/Price when selecting a food
    if (!form.foodId) return;
    const f = foods.find((x) => x.id === form.foodId);
    if (!f) return;

    setForm((p) => ({
      ...p,
      name_override: f.name,
      description_override: f.description,
      floor_level_price_override_cents: f.base_price_cents,
    }));
  }, [form.foodId, foods]);

  const validateForm = () => {
    if (!form.foodId) {
      setMessage({ type: "error", text: "Please select a food." });
      return false;
    }
    if (!form.name_override.trim()) {
      setMessage({ type: "error", text: "Name cannot be empty." });
      return false;
    }
    if (
      !form.floor_level_price_override_cents ||
      form.floor_level_price_override_cents <= 0
    ) {
      setMessage({ type: "error", text: "Please enter a valid price." });
      return false;
    }
    if (!form.default_quantity || form.default_quantity <= 0) {
      setMessage({ type: "error", text: "Please enter a valid quantity." });
      return false;
    }
    return true;
  };

  const submit = () => {
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    const payload = {
      vendor_branch_food: form.foodId,
      name_override: form.name_override,
      description_override: form.description_override,
      floor_level_price_override_cents: Number(
        form.floor_level_price_override_cents
      ),
      default_quantity: Number(form.default_quantity),
    };

    const call = floorFood?.id
      ? updateFloorFood(floorFood.id, payload)
      : assignFoodToFloor(form.floorId, payload);

    call
      .then(() => {
        setMessage({
          type: "success",
          text: floorFood
            ? "Food updated successfully!"
            : "Food added successfully!",
        });
        onSuccess();
      })
      .catch((err) => {
        setMessage({
          type: "error",
          text: err.response?.data?.detail || "Something went wrong.",
        });
      })
      .finally(() => setLoading(false));
  };

  if (!form) return null;

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div className="modal fade show" style={{ display: "block" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">
                {floorFood?.id ? "Edit Floor Food" : "Add Food to Floor"}
              </h6>
              <button className="btn btn-light btn-sm" onClick={onClose}>
                ✕
              </button>
            </div>

            {message && (
              <div
                className={`alert d-flex align-items-center ${
                  message.type === "success" ? "alert-success" : "alert-danger"
                } mb-2`}
                role="alert"
              >
                {message.type === "success" ? (
                  <CheckCircle size={16} className="me-1" />
                ) : (
                  <AlertCircle size={16} className="me-1" />
                )}
                {message.text}
              </div>
            )}

            {/* Food selection */}
            <select
              className="form-select mb-2"
              value={form.foodId}
              disabled={!!floorFood?.id}
              onChange={(e) =>
                setForm({ ...form, foodId: Number(e.target.value) })
              }
            >
              <option value="">Select Food</option>
              {foods.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>

            <input
              className="form-control mb-2"
              placeholder="Name Override"
              value={form.name_override}
              onChange={(e) =>
                setForm({ ...form, name_override: e.target.value })
              }
            />

            <textarea
              className="form-control mb-2"
              placeholder="Description Override"
              value={form.description_override}
              onChange={(e) =>
                setForm({ ...form, description_override: e.target.value })
              }
            />

            <div className="input-group mb-2">
              <span className="input-group-text">
                <IndianRupee size={14} />
              </span>
              <input
                type="number"
                className="form-control"
                placeholder="Floor Level Price"
                value={form.floor_level_price_override_cents}
                onChange={(e) =>
                  setForm({
                    ...form,
                    floor_level_price_override_cents: Number(e.target.value),
                  })
                }
              />
            </div>

            <input
              type="number"
              className="form-control mb-3"
              placeholder="Quantity"
              value={form.default_quantity}
              onChange={(e) =>
                setForm({ ...form, default_quantity: Number(e.target.value) })
              }
            />

            <div className="text-end">
              <button className="btn btn-light me-2" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
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
