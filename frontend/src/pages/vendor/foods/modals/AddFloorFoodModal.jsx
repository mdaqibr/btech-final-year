import { useEffect, useState } from "react";
import {
  getVendorBranchFoods,
  assignFoodToFloor,
  updateFloorFood,
} from "../../../../api/vendor";

export default function AddFloorFoodModal({
  show,
  floorFood,
  onClose,
  onSuccess,
}) {
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState({
    vendor_branch_food: "",
    floor_level_price_override_cents: "",
    name_override: "",
    description_override: "",
    default_quantity: "",
  });

  useEffect(() => {
    getVendorBranchFoods(floorFood.floorId).then((res) => setFoods(res.data));

    if (floorFood.id) {
      setForm({ ...floorFood });
    }
  }, [floorFood]);

  const handleSubmit = async () => {
    if (floorFood.id) {
      await updateFloorFood(floorFood.id, form);
    } else {
      await assignFoodToFloor(floorFood.floorId, form);
    }
    onSuccess();
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div className="modal fade show" style={{ display: "block" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow">
            <div className="modal-header">
              <h5>{floorFood.id ? "Edit Food" : "Add Food"}</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {!floorFood.id && (
                <select
                  className="form-select mb-2"
                  onChange={(e) =>
                    setForm({ ...form, vendor_branch_food: e.target.value })
                  }
                >
                  <option>Select Food</option>
                  {foods.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.food_name}
                    </option>
                  ))}
                </select>
              )}

              <input
                className="form-control mb-2"
                placeholder="Price Override"
                onChange={(e) =>
                  setForm({
                    ...form,
                    floor_level_price_override_cents: e.target.value,
                  })
                }
              />
              <input
                className="form-control mb-2"
                placeholder="Name Override"
                onChange={(e) =>
                  setForm({ ...form, name_override: e.target.value })
                }
              />
              <textarea
                className="form-control mb-2"
                placeholder="Description Override"
                onChange={(e) =>
                  setForm({ ...form, description_override: e.target.value })
                }
              />
              <input
                className="form-control"
                placeholder="Default Quantity"
                onChange={(e) =>
                  setForm({ ...form, default_quantity: e.target.value })
                }
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-light" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
