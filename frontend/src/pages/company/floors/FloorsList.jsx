// src/pages/company/floors/FloorsList.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EntityCard from "../../../components/common/EntityCard";
import AddFloorModal from "./AddFloorModal";
import { getFloors } from "../../../api/floors";

const FloorsList = () => {
  const { branchId, buildingId } = useParams();
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFloors();
    // eslint-disable-next-line
  }, [buildingId]);

  const fetchFloors = async () => {
    setLoading(true);
    try {
      const data = await getFloors(branchId, buildingId);
      const items = Array.isArray(data) ? data : data?.data || [];
      setFloors(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Floors</h2>
          <p className="text-muted small mb-0">
            Select a floor to view its dashboard
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          + Add Floor
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">Loading floors…</div>
      ) : floors.length > 0 ? (
        <div className="row g-3">
          {floors.map((f) => (
            <div key={f.id} className="col-12 col-md-6 col-lg-4">
              <EntityCard
                title={f.floor_name || `Floor ${f.floor_number}`}
                subtitle={`Floor No: ${f.floor_number}`}
                onClick={() =>
                  navigate(
                    `/company/branches/${branchId}/buildings/${buildingId}/floors/${f.id}/dashboard`
                  )
                }
                accent="linear-gradient(135deg,#f6fff5,#e6ffef)"
              />
            </div>
          ))}
        </div>
      ) : (
        // EMPTY STATE
        <div className="container py-4">
          <div className="row">
            <div className="col-12 col-md-6">
              <div
                className="p-4 rounded shadow-sm text-center"
                style={{
                  background: "linear-gradient(135deg,#fff8f5,#fff)",
                  border: "1px solid #f1e0db",
                }}
              >
                <h5 className="mb-2">No floors found</h5>
                <p className="text-muted">Add a floor to continue.</p>

                <button
                  className="btn btn-primary"
                  onClick={() => setShowAdd(true)}
                >
                  Add Floor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <AddFloorModal
          branchId={branchId}
          buildingId={buildingId}
          onClose={() => setShowAdd(false)}
          onSuccess={fetchFloors}
        />
      )}
    </div>
  );
};

export default FloorsList;
