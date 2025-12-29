import { useEffect, useState } from "react";
import { IndianRupee } from "lucide-react";
import { assignFoodToFloor, updateFloorFood } from "../../../../api/vendor";

export default function AddFloorFoodModal({
  floorFood,
  branchFoods,
  floorFoods,
  onClose,
  onSuccess,
}) {
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState({
    floorId: null,
    foodId: "",
    name_override: "",
    description_override: "",
    floor_level_price_override_cents: 0,
    default_quantity: 1,
  });

  const [loading, setLoading] = useState(false);

  // ---------------- SET DATA ----------------
  useEffect(() => {
    if (!floorFood || branchFoods.length === 0) return;

    // -------- ADD MODE --------
    if (floorFood.floorId && !floorFood.id) {
      setForm({
        floorId: floorFood.floorId,
        foodId: "",
        name_override: "",
        description_override: "",
        floor_level_price_override_cents: 0,
        default_quantity: 1,
      });

      const assignedIds = (floorFoods[floorFood.floorId] || []).map(
        (f) => f.vendor_branch_food
      );

      const available = branchFoods.filter((f) => !assignedIds.includes(f.id));

      setFoods(
        available.map((f) => ({
          id: f.id,
          name: f.food_name,
          description: f.description,
          base_price_cents:
            f.branch_level_price_override_cents ?? f.base_price_cents,
        }))
      );
    }

    // -------- EDIT MODE --------
    if (floorFood.id) {
      setForm({
        floorId: floorFood.floor_id,
        foodId: floorFood.vendor_branch_food,
        name_override: floorFood.name_override || "",
        description_override: floorFood.description_override || "",
        floor_level_price_override_cents:
          floorFood.floor_level_price_override_cents ??
          floorFood.food_price_cents ??
          0,
        default_quantity: floorFood.default_quantity || 1,
      });

      setFoods([
        {
          id: floorFood.vendor_branch_food,
          name: floorFood.food_name,
          description: floorFood.description_override,
          base_price_cents: floorFood.food_price_cents,
        },
      ]);
    }
  }, [floorFood, branchFoods, floorFoods]);

  // -------- AUTO PREFILL NAME, DESC & PRICE --------
  useEffect(() => {
    if (!form.foodId) return;

    const f = foods.find((x) => x.id === form.foodId);
    if (!f) return;

    setForm((p) => ({
      ...p,
      floor_level_price_override_cents: f.base_price_cents,
      name_override: f.name,
      description_override: f.description,
    }));
  }, [form.foodId]);

  if (!floorFood) return null;

  const submit = () => {
    setLoading(true);

    const payload = {
      vendor_branch_food: form.foodId,
      name_override: form.name_override,
      description_override: form.description_override,
      floor_level_price_override_cents: Number(
        form.floor_level_price_override_cents
      ),
      default_quantity: Number(form.default_quantity),
    };

    const call = floorFood.id
      ? updateFloorFood(floorFood.id, payload)
      : assignFoodToFloor(form.floorId, payload);

    call
      .then(() => {
        onSuccess();
        onClose();
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div className="modal fade show" style={{ display: "block" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-3">
            <h6>{floorFood.id ? "Edit Floor Food" : "Add Food to Floor"}</h6>

            <select
              className="form-select my-2"
              value={form.foodId}
              disabled={!!floorFood.id}
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
              placeholder="Name override"
              value={form.name_override}
              onChange={(e) =>
                setForm({ ...form, name_override: e.target.value })
              }
            />

            <textarea
              className="form-control mb-2"
              placeholder="Description override"
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
              value={form.default_quantity}
              onChange={(e) =>
                setForm({ ...form, default_quantity: Number(e.target.value) })
              }
            />

            <div className="text-end">
              <button className="btn btn-light me-2" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={submit}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
