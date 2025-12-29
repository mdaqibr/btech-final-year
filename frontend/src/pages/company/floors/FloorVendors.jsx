import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFloorVendors } from "../../../api/floors";
import { Store, PlusCircle, Clock, TrendingUp, Building2 } from "lucide-react";

const statusColors = {
  pending: "bg-warning text-dark",
  approved: "bg-success",
  rejected: "bg-danger",
  removed: "bg-secondary",
};

const FloorVendors = () => {
  const { branchId, buildingId, floorId } = useParams();
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFloorVendors(branchId, buildingId, floorId)
      .then(setVendors)
      .finally(() => setLoading(false));
  }, [branchId, buildingId, floorId]);

  if (loading) {
    return (
      <div className="container py-5 text-center text-muted">
        Loading vendors…
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* ================= HEADER ================= */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Building2 size={22} className="text-primary" />
            Floor Vendors
          </h3>
          <p className="text-muted mb-0">
            Vendors currently associated with this floor
          </p>
        </div>

        <button
          className="btn btn-primary d-inline-flex align-items-center gap-2"
          onClick={() => navigate("/company/vendors")}
        >
          <PlusCircle size={18} />
          Onboard New Vendors
        </button>
      </div>

      {/* ================= VENDOR LIST ================= */}
      <div className="row g-3">
        {vendors.map((v) => (
          <div key={v.company_vendor_id} className="col-12 col-sm-6 col-lg-4">
            <div
              className="card vendor-card border-0 shadow-sm h-100"
              onClick={() =>
                navigate(
                  `/company/branches/${branchId}/buildings/${buildingId}/floors/${floorId}/vendors/${v.company_vendor_id}/performance`
                )
              }
            >
              <div className="card-body d-flex gap-3">
                {/* Logo */}
                <div className="vendor-logo rounded d-flex align-items-center justify-content-center">
                  {v.vendor_logo ? (
                    <img
                      src={v.vendor_logo}
                      alt={v.vendor_name}
                      className="img-fluid rounded"
                    />
                  ) : (
                    <Store size={26} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-grow-1">
                  <h6 className="fw-semibold mb-1">{v.vendor_name}</h6>

                  <p className="text-muted small mb-2">
                    {v.vendor_branch_name}
                  </p>

                  <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                    <span
                      className={`badge ${
                        statusColors[v.status]
                      } text-capitalize`}
                    >
                      {v.status}
                    </span>
                  </div>

                  {/* Timing */}
                  <div className="small text-muted d-flex align-items-center gap-1">
                    <Clock size={14} />
                    {v.service_opening_time && v.service_closing_time ? (
                      <>
                        {v.service_opening_time} – {v.service_closing_time}
                      </>
                    ) : (
                      "Service timing not set"
                    )}
                  </div>
                </div>

                {/* Right Icon */}
                <div className="align-self-center text-muted">
                  <TrendingUp size={18} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ================= EMPTY STATE ================= */}
        {!vendors.length && (
          <div className="col-12">
            <div className="text-center py-5 border rounded bg-light">
              <Store size={48} className="mb-3 text-muted" />
              <h5 className="fw-semibold">No vendors onboarded yet</h5>
              <p className="text-muted mb-4">
                Start by exploring vendors and request onboarding for this
                floor.
              </p>

              <button
                className="btn btn-primary d-inline-flex align-items-center gap-2"
                onClick={() => navigate("/company/vendors")}
              >
                <PlusCircle size={18} />
                Onboard New Vendors
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= STYLES ================= */}
      <style>
        {`
          .vendor-card {
            cursor: pointer;
            transition: transform .18s ease, box-shadow .18s ease;
            background: linear-gradient(180deg,#ffffff,#f8fafc);
          }

          .vendor-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 14px 28px rgba(0,0,0,.1);
          }

          .vendor-logo {
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg,#eef2ff,#e0e7ff);
          }
        `}
      </style>
    </div>
  );
};

export default FloorVendors;
