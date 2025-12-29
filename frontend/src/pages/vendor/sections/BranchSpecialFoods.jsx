import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getSpecialFoods, deleteSpecialFood } from "../../../api/vendor";

export default function BranchSpecialFoods({ branchId }) {
  const [foods, setFoods] = useState([]);

  const fetchData = () =>
    getSpecialFoods(branchId).then((r) => setFoods(r.data));

  useEffect(() => {
    fetchData();
  }, [branchId]);

  return (
    <>
      <h6 className="fw-bold mb-3">Today's Special Foods</h6>

      {foods.map((f) => (
        <div key={f.id} className="vendor-card card p-3 mb-2">
          <div className="d-flex justify-content-between">
            <div>
              <div className="fw-semibold">{f.name}</div>
              <div className="small text-muted">₹{f.price_cents / 100}</div>
            </div>
            <button
              className="btn btn-light btn-sm text-danger"
              onClick={() => deleteSpecialFood(f.id).then(fetchData)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
