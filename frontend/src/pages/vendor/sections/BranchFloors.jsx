// src / pages / vendor / sections / BranchFloors.jsx;
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  getApprovedFloors,
  getBranchFloorFoods,
  removeFoodFromFloor,
  getBranchFoods, // branch-specific foods
} from "../../../api/vendor";
import AddFloorFoodModal from "./modals/AddFloorFoodModal";

export default function BranchFloors({ branchId }) {
  const [floors, setFloors] = useState([]);
  const [floorFoods, setFloorFoods] = useState({});
  const [branchFoods, setBranchFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFloorFood, setSelectedFloorFood] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getApprovedFloors();
      const branchFloors = res.data.filter(
        (x) => Number(x.vendor_branch_id) === Number(branchId)
      );
      setFloors(branchFloors);

      // fetch foods for each floor
      const ffMap = {};
      await Promise.all(
        branchFloors.map(async (floor) => {
          const r = await getBranchFloorFoods(floor.floor_id);
          ffMap[floor.floor_id] = r.data;
        })
      );
      setFloorFoods(ffMap);

      // fetch branch-assigned foods
      const branchFoodsRes = await getBranchFoods(branchId);
      setBranchFoods(branchFoodsRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (branchId) fetchData();
  }, [branchId]);

  const handleRemove = async (floorFoodId) => {
    if (!window.confirm("Remove this food from floor?")) return;
    await removeFoodFromFloor(floorFoodId);
    fetchData();
  };

  return (
    <>
      <h6 className="fw-bold mb-3">Floor Food Assignment</h6>
      {loading && <div className="skeleton" style={{ height: 200 }} />}
      {!loading && floors.length === 0 && (
        <div className="text-muted">No approved floors for this branch.</div>
      )}

      {!loading &&
        floors.map((floor) => (
          <div key={floor.floor_id} className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-semibold">
                {floor.floor_name} — {floor.building_name}
              </h6>
              <button
                className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                onClick={() => {
                  setSelectedFloorFood({ id: null, floorId: floor.floor_id });
                  setShowModal(true);
                }}
              >
                <Plus size={14} /> Add Food
              </button>
            </div>

            <div className="row g-3">
              {(floorFoods[floor.floor_id] || []).length === 0 && (
                <div className="col-12 text-muted small">
                  No foods assigned to this floor yet.
                </div>
              )}

              {(floorFoods[floor.floor_id] || []).map((ff) => (
                <div key={ff.id} className="col-md-4">
                  <div className="vendor-card card p-3 h-100 d-flex justify-content-between flex-column">
                    <div>
                      <div className="fw-semibold">{ff.name_override}</div>
                      <div className="text-muted small">
                        ₹{ff.floor_level_price_override_cents}
                      </div>
                      {ff.description_override && (
                        <div className="text-muted small">
                          {ff.description_override}
                        </div>
                      )}
                      {ff.default_quantity && (
                        <div className="text-muted small">
                          Qty: {ff.default_quantity}
                        </div>
                      )}
                    </div>

                    <div className="d-flex gap-2 mt-2">
                      <button
                        className="btn btn-light btn-sm"
                        onClick={() => {
                          setSelectedFloorFood(ff);
                          setShowModal(true);
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="btn btn-light btn-sm text-danger"
                        onClick={() => handleRemove(ff.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      {showModal && (
        <AddFloorFoodModal
          floorFood={selectedFloorFood}
          branchFoods={branchFoods}
          floorFoods={floorFoods}
          onClose={() => {
            setShowModal(false);
            setSelectedFloorFood(null);
          }}
          onSuccess={fetchData}
        />
      )}
    </>
  );
}
