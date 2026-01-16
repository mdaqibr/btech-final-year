import { useState, useEffect } from "react";
import { saveMenuItem, updateMenuItem } from "../../../../api/menu";

export default function MenuItemModal({
  show,
  onClose,
  food,
  menuId,
  editItem,
  reload,
}) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (food) {
      setForm({
        special_name_override: food.special_name_override || food.food_name,
        special_price_override_cents:
          food.special_price_override_cents ||
          food.floor_level_price_override_cents ||
          "",
        remaining_quantity:
          food.remaining_quantity || food.default_quantity || "",
        is_available: food.is_available ?? true,
      });
    }
  }, [food]);

  if (!show || !food) return null;

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const submit = async () => {
    const payload = {
      daily_menu: menuId,
      floor_food: food.id,
      ...form,
    };

    if (editItem) {
      await updateMenuItem(editItem.id, payload);
    } else {
      await saveMenuItem(payload);
    }
    reload();
    onClose();
  };

  return (
    <div className="modal fade show d-block bg-dark bg-opacity-50">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header">
            <h6>{food.food_name}</h6>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              className="form-control mb-2"
              placeholder="Special Name"
              value={form.special_name_override || ""}
              onChange={(e) =>
                handleChange("special_name_override", e.target.value)
              }
            />
            <input
              className="form-control mb-2"
              type="number"
              placeholder="Special Price"
              value={form.special_price_override_cents || ""}
              onChange={(e) =>
                handleChange("special_price_override_cents", e.target.value)
              }
            />
            <input
              className="form-control mb-2"
              type="number"
              placeholder="Remaining Quantity"
              value={form.remaining_quantity || ""}
              onChange={(e) =>
                handleChange("remaining_quantity", e.target.value)
              }
            />
            <div className="form-check form-switch mt-2">
              <input
                className="form-check-input"
                type="checkbox"
                checked={form.is_available}
                onChange={(e) => handleChange("is_available", e.target.checked)}
              />
              <label className="form-check-label">Available</label>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={submit}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
