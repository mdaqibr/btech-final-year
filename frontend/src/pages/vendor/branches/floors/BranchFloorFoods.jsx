import { Trash2 } from "lucide-react";
import { removeFoodFromFloor } from "../../../../api/vendor";

export default function FloorFoodCard({ item, onRefresh }) {
  const removeFood = async () => {
    if (!window.confirm("Remove this food from floor?")) return;
    await removeFoodFromFloor(item.id);
    onRefresh();
  };

  return (
    <div className="card border-0 shadow-sm p-3">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div className="fw-semibold">{item.name}</div>
          <div className="text-muted small">₹{item.final_price_cents}</div>
        </div>

        <button
          className="btn btn-light btn-sm text-danger"
          onClick={removeFood}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
