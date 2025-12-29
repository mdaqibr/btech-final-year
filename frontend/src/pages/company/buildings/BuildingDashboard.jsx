// src/pages/company/buildings/BuildingDashboard.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFloors } from "../../../api/floors";

const dashboardItems = (branchId, buildingId) => [
  {
    label: "Floors",
    path: `/company/branches/${branchId}/buildings/${buildingId}/floors`,
  },
];

const BuildingDashboard = () => {
  const { branchId, buildingId } = useParams();
  const navigate = useNavigate();

  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFloors();
  }, [buildingId]);

  const loadFloors = async () => {
    setLoading(true);
    try {
      const data = await getFloors(buildingId);
      const items = Array.isArray(data) ? data : data?.data || [];
      setFloors(items);
    } catch (err) {
      console.error(err);
      setFloors([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container py-4">Loading…</div>;

  return (
    <>
      {/* Inline CSS */}
      <style>{`
        .dash-card {
          padding: 18px;
          border-radius: 14px;
          background: white;
          border: 1px solid #eee;
          transition: all 0.25s ease;
          cursor: pointer;
          text-align: center;
          font-weight: 600;
        }
        .dash-card:hover {
          transform: translateY(-5px);
          box-shadow: 0px 10px 20px rgba(0,0,0,0.12);
          background: #fafafa;
        }

        .floor-card {
          background: #ffffff;
          border-radius: 14px;
          transition: all 0.25s ease;
          transform: translateY(0);
          cursor: pointer;
          border: 1px solid #f1f1f1;
        }
        .floor-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12);
          background: linear-gradient(135deg, #ffffff, #fafafa);
        }
      `}</style>

      <div className="container py-4">
        <h3 className="fw-bold mb-4">Manage Building</h3>

        <div className="row g-3 mb-4">
          {dashboardItems(branchId, buildingId).map((item, idx) => (
            <div key={idx} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="dash-card" onClick={() => navigate(item.path)}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BuildingDashboard;
