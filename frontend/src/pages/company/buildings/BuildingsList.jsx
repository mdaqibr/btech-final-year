import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import EntityCard from "../../../components/common/EntityCard";
import AddBuildingModal from "./AddBuildingModal";
import { getBuildings } from "../../../api/buildings";

const BuildingsList = () => {
  const { branchId } = useParams();
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBuildings();
  }, [branchId]);

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const data = await getBuildings(branchId);
      const items = Array.isArray(data) ? data : data?.data || [];
      setBuildings(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ animation: "fadeIn 0.5s ease" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; }}
        .hover-scale { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-scale:hover { transform: scale(1.04) translateY(-4px); box-shadow: 0 10px 22px rgba(0,0,0,0.15); }
      `}</style>

      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center mb-4 p-3 rounded shadow-sm"
        style={{ background: "white" }}
      >
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="lucide lucide-building-2"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 22V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v18" />
              <path d="M18 22V8a2 2 0 0 0-2-2h-2" />
              <path d="M6 12h4" />
              <path d="M6 16h4" />
              <path d="M6 20h4" />
              <path d="M14 12h2" />
              <path d="M14 16h2" />
            </svg>
            Buildings
          </h2>
          <p className="text-muted small mb-0">
            Manage and navigate your buildings inside this branch
          </p>
        </div>

        <button
          className="btn btn-primary d-flex align-items-center gap-2 shadow-sm hover-scale"
          onClick={() => setShowAdd(true)}
        >
          <PlusCircle size={18} /> Add Building
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Fetching buildings…</p>
        </div>
      ) : (
        <div className="row g-4">
          {/* Empty State */}
          {buildings.length === 0 && (
            <div className="col-12">
              <div
                className="p-5 text-center rounded shadow-sm hover-scale"
                style={{
                  background: "linear-gradient(135deg,#f8faff,#ffffff)",
                }}
              >
                <h4 className="mb-2">No Buildings Found</h4>
                <p className="text-muted mb-3">
                  Start by creating your first building
                </p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setShowAdd(true)}
                >
                  Create Building
                </button>
              </div>
            </div>
          )}

          {/* Building Cards */}
          {buildings.map((b) => (
            <div key={b.id} className="col-12 col-sm-6 col-lg-4">
              <div
                className="hover-scale rounded shadow-sm p-0"
                style={{ overflow: "hidden" }}
              >
                <EntityCard
                  title={b.building_name || b.name}
                  subtitle={`Floors: ${b.floor_count || 0}`}
                  accent="linear-gradient(135deg,#eef7ff,#ffffff)"
                  onClick={() =>
                    navigate(
                      `/company/branches/${branchId}/buildings/${b.id}/dashboard`
                    )
                  }
                  badge={
                    b.floor_count ? `${b.floor_count} floors` : "No floors"
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <AddBuildingModal
          branchId={branchId}
          onClose={() => setShowAdd(false)}
          onSuccess={fetchBuildings}
        />
      )}
    </div>
  );
};

export default BuildingsList;
