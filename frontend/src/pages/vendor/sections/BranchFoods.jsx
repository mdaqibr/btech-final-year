import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getVendorFoods,
  getVendorBranchFoods,
  assignFoodToBranch,
  updateBranchFood,
  removeFoodFromBranch,
} from "../../../api/vendor";

export default function BranchFoods({ branchId }) {
  const [foods, setFoods] = useState([]);
  const [branchFoods, setBranchFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [f, bf] = await Promise.all([
        getVendorFoods(),
        getVendorBranchFoods(branchId),
      ]);

      setFoods(f.data);
      setBranchFoods(bf.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (branchId) fetchData();
  }, [branchId]);

  if (loading) return <div>Loading foods...</div>;

  const assignedFoodIds = branchFoods.map((bf) => bf.food);

  return (
    <>
      <h6 className="fw-bold mb-3">Branch Assigned Foods</h6>

      {/* ASSIGNED FOODS */}
      {branchFoods.length === 0 && (
        <div className="text-muted mb-3">No foods assigned yet.</div>
      )}

      {branchFoods.map((bf) => (
        <div key={bf.id} className="vendor-card card border-0 mb-2 p-3">
          <div className="d-flex justify-content-between align-items-center gap-3">
            {/* LEFT */}
            <div className="d-flex flex-column overflow-hidden">
              <div className="fw-semibold text-truncate">{bf.food_name}</div>

              <div className="text-muted small">
                Base Price: ₹{bf.base_price_cents}
              </div>

              <div className="small text-muted mt-1">
                Override Price (₹)
                <input
                  type="number"
                  className="form-control form-control-sm mt-1"
                  placeholder="Leave blank to use base price"
                  value={
                    bf.branch_level_price_override_cents !== null
                      ? bf.branch_level_price_override_cents
                      : ""
                  }
                  onChange={(e) =>
                    updateBranchFood(bf.id, {
                      branch_level_price_override_cents: e.target.value
                        ? Number(e.target.value)
                        : null,
                    }).then(fetchData)
                  }
                />
              </div>
            </div>

            {/* ACTIONS */}
            <button
              className="btn btn-light btn-sm text-danger"
              title="Remove Food"
              onClick={() => removeFoodFromBranch(bf.id).then(fetchData)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}

      <hr className="my-4" />

      {/* ADD NEW FOODS */}
      <h6 className="fw-bold mb-3">Add More Foods</h6>

      {foods
        .filter((f) => !assignedFoodIds.includes(f.id))
        .map((f) => (
          <div key={f.id} className="vendor-card card p-3 mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-semibold">{f.name}</div>
                <div className="small text-muted">₹{f.base_price_cents}</div>
              </div>

              <button
                className="btn btn-primary btn-sm"
                onClick={() =>
                  assignFoodToBranch(branchId, {
                    food: f.id,
                    branch_level_price_override_cents: null,
                  }).then(fetchData)
                }
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>
        ))}
    </>
  );
}
