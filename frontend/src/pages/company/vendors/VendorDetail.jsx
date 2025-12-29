// src/pages/company/vendors/VendorDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Store, Building2, MapPin, PlusCircle } from "lucide-react";
import {
  getVendorDetail,
  getCompanyFloors,
  requestVendorOnboard,
} from "../../../api/vendor";

const statusColors = {
  approved: "bg-success",
  pending: "bg-warning text-dark",
  rejected: "bg-danger",
  removed: "bg-secondary",
};

const VendorDetail = () => {
  const { vendorId } = useParams();

  const [vendor, setVendor] = useState(null);
  const [floors, setFloors] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  /* ================= FETCH VENDOR ================= */
  useEffect(() => {
    getVendorDetail(vendorId).then(setVendor);
  }, [vendorId]);

  /* ================= LOAD FLOORS ON MODAL OPEN ================= */
  const handleModalOpen = async (branch) => {
    setSelectedBranch(branch);
    setSelectedFloor("");
    setMessage(null);

    if (!floors.length) {
      try {
        const data = await getCompanyFloors();
        setFloors(data);
      } catch {
        setMessage({
          type: "danger",
          text: "Failed to load floors. Please try again.",
        });
      }
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!selectedBranch || !selectedFloor) {
      setMessage({
        type: "warning",
        text: "Please select a floor.",
      });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      await requestVendorOnboard({
        vendor: vendorId,
        vendor_branch: selectedBranch.id,
        floor: selectedFloor,
      });

      setMessage({
        type: "success",
        text: "Vendor onboarding request submitted successfully.",
      });

      setTimeout(() => {
        const modal = window.bootstrap.Modal.getInstance(
          document.getElementById("onboardModal")
        );
        modal?.hide();
      }, 1200);
    } catch {
      setMessage({
        type: "danger",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!vendor) {
    return (
      <div className="container py-5 text-center text-muted">
        Loading vendor details…
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* ================= HEADER ================= */}
      <div className="d-flex align-items-center gap-4 mb-4">
        <div className="vendor-logo d-flex align-items-center justify-content-center rounded-3 shadow-sm">
          {vendor.logo ? (
            <img
              src={vendor.logo}
              alt={vendor.name}
              className="img-fluid rounded"
            />
          ) : (
            <Store size={34} />
          )}
        </div>

        <div className="flex-grow-1">
          <h2 className="fw-bold mb-1">{vendor.name}</h2>
          <p className="text-muted mb-0">
            Active across <strong>{vendor.branches.length}</strong> locations
          </p>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="row g-4">
        {/* -------- BRANCHES -------- */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="fw-semibold d-flex align-items-center gap-2">
                <MapPin size={18} className="text-primary" />
                Vendor Branches
              </h5>
            </div>

            <div className="card-body">
              {vendor.branches.map((b) => (
                <div
                  key={b.id}
                  className="vendor-item p-3 rounded mb-2 d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{b.branch_name}</strong>
                    <div className="text-muted small">
                      {b.city}, {b.state}
                    </div>
                  </div>

                  <button
                    className="btn btn-sm btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#onboardModal"
                    onClick={() => handleModalOpen(b)}
                  >
                    <PlusCircle size={14} className="me-1" />
                    Request
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* -------- COMPANIES -------- */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="fw-semibold d-flex align-items-center gap-2">
                <Building2 size={18} className="text-success" />
                Associated Companies
              </h5>
            </div>

            <div className="card-body">
              {vendor.companies.map((c) => (
                <div
                  key={c.id}
                  className="company-item p-3 rounded d-flex justify-content-between align-items-center mb-2"
                >
                  {c.company_name}
                  <span className={`badge ${statusColors[c.status]}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <div className="modal fade" id="onboardModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Request Vendor Onboarding</h5>
              <button className="btn-close" data-bs-dismiss="modal" />
            </div>

            <div className="modal-body">
              {message && (
                <div className={`alert alert-${message.type} py-2`}>
                  {message.text}
                </div>
              )}

              {selectedBranch && (
                <div className="mb-3">
                  <strong>Selected Branch</strong>
                  <div className="text-muted small">
                    {selectedBranch.branch_name} – {selectedBranch.city}
                  </div>
                </div>
              )}

              <label className="form-label fw-semibold">Select Floor</label>
              <select
                className="form-select"
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
              >
                <option value="">Branch – Building – Floor</option>
                {floors.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.display_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? "Submitting..." : "Submit request"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .vendor-logo {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg,#eef2ff,#e0e7ff);
        }
        .vendor-item:hover { background:#eef2ff; }
        .company-item:hover { background:#ecfdf5; }
      `}</style>
    </div>
  );
};

export default VendorDetail;
