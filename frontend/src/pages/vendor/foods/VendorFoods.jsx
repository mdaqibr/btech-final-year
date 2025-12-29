import { Plus, Pencil, Trash2, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { getVendorFoods, deleteVendorFood } from "../../../api/vendor";
import AddFoodModal from "./modals/AddFoodModal";

export default function VendorFoods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const fetchFoods = () => {
    setLoading(true);
    getVendorFoods()
      .then((r) => setFoods(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  return (
    <>
      <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
        <Utensils size={18} /> Food Items
      </h5>

      {foods.map((f) => (
        <div
          key={f.id}
          className="vendor-card card border-0 shadow-sm mb-2 p-3"
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="overflow-hidden">
              <div className="fw-semibold text-truncate">{f.name}</div>
              <div className="text-muted small">
                {f.type} • {f.category}
              </div>
              <div className="small text-muted">₹{f.base_price_cents}</div>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-light btn-sm"
                onClick={() => {
                  setSelectedFood(f);
                  setShowModal(true);
                }}
              >
                <Pencil size={14} />
              </button>
              <button
                className="btn btn-light btn-sm text-danger"
                onClick={() => deleteVendorFood(f.id).then(fetchFoods)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}

      <div
        className="vendor-card card border-0 shadow-sm p-3 cursor-pointer"
        onClick={() => {
          setSelectedFood(null);
          setShowModal(true);
        }}
      >
        <div className="d-flex align-items-center gap-2 text-primary fw-semibold">
          <Plus size={16} /> Add Food
        </div>
      </div>

      <AddFoodModal
        show={showModal}
        food={selectedFood}
        onClose={() => {
          setShowModal(false);
          setSelectedFood(null);
        }}
        onSuccess={fetchFoods}
      />
    </>
  );
}
