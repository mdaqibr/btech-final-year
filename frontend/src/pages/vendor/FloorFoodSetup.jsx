import { useEffect, useState } from "react";
import {
  getBranchFloorFoods,
  getBranchFoods,
  removeFoodFromFloor,
} from "../../api/vendor";
import AddFloorFoodModal from "./sections/modals/AddFloorFoodModal";
import { Plus, Trash2, Pencil } from "lucide-react";

export default function FloorFoodSetup({ floorId, vendorBranchId }) {
  const [foods, setFoods] = useState([]);
  const [branchFoods, setBranchFoods] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const fetchData = async () => {
    if (!floorId || !vendorBranchId) return;

    const r = await getBranchFloorFoods(floorId);
    setFoods(r.data || []);

    const bf = await getBranchFoods(vendorBranchId);
    setBranchFoods(bf.data || []);
  };

  useEffect(() => {
    fetchData();
  }, [floorId, vendorBranchId]);

  const handleAdd = () => {
    setSelectedFood(null); // ADD mode
    setShowModal(true);
  };

  const handleEdit = (food) => {
    setSelectedFood(food); // EDIT mode
    setShowModal(true);
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h5 className="fw-bold">Floor Food Setup</h5>
        <button className="btn btn-primary btn-sm" onClick={handleAdd}>
          <Plus size={14} /> Add Food
        </button>
      </div>

      <div className="row g-3">
        {foods.map((ff) => (
          <div key={ff.id} className="col-md-4">
            <div className="card p-3 h-100 shadow-sm">
              <div className="fw-semibold">
                {ff.name_override || ff.food_name}
              </div>
              <div className="text-muted small">
                ₹{ff.floor_level_price_override_cents ?? ff.food_price_cents}
              </div>
              <div className="text-muted small">
                {ff.description_override || ff.description || ""}
              </div>
              <div className="text-muted small">
                Quantity: {ff.default_quantity || 1}
              </div>

              <div className="d-flex gap-2 mt-2">
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => handleEdit(ff)}
                >
                  <Pencil size={14} />
                </button>
                <button
                  className="btn btn-light btn-sm text-danger"
                  onClick={() => removeFoodFromFloor(ff.id).then(fetchData)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <AddFloorFoodModal
          floorId={floorId}
          floorFood={selectedFood}
          branchFoods={branchFoods}
          assignedFoods={foods}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            fetchData();
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}
