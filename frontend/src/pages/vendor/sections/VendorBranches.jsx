import { MapPin, Plus, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVendorBranches } from "../../../api/vendor";
import AddBranchModal from "../shared/AddBranchModal";

export default function VendorBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = () => {
    setLoading(true);
    getVendorBranches()
      .then((res) => setBranches(res.data))
      .finally(() => setLoading(false));
  };

  const visibleBranches = branches.slice(0, 3);
  const hasMore = branches.length > 3;

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h5 className="fw-bold">Your Branches</h5>
      </div>

      {loading && <div className="skeleton mb-4" style={{ height: 120 }} />}

      {!loading && branches.length === 0 && (
        <div className="text-muted mb-4">No branches added yet.</div>
      )}

      <div className="row g-3 mb-4">
        {visibleBranches.map((b) => {
          const isActive = b.is_active ?? true; // fallback if backend not sending

          return (
            <div key={b.id} className="col-md-4">
              <div className="vendor-card card p-3 h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <h6 className="fw-semibold mb-1">{b.branch_name}</h6>

                  {/* STATUS TAG */}
                  <span
                    className={`d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill ${
                      isActive ? "text-success" : "text-secondary"
                    }`}
                    style={{
                      fontSize: "0.7rem",
                      background: isActive
                        ? "rgba(25,135,84,0.1)"
                        : "rgba(108,117,125,0.1)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isActive ? (
                      <CheckCircle size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-muted small mb-0 mt-1">
                  <MapPin size={14} /> {b.city}, {b.state}
                </p>
              </div>
            </div>
          );
        })}

        {/* ADD BRANCH CARD */}
        <div className="col-md-4">
          <div
            className="vendor-card card p-3 h-100 add-card"
            onClick={() => setShowModal(true)}
          >
            <div className="text-center text-primary">
              <Plus size={28} />
              <div className="fw-semibold mt-2">Add New Branch</div>
            </div>
          </div>
        </div>

        {/* SEE MORE CARD */}
        {hasMore && (
          <div className="col-md-4">
            <div
              className="vendor-card card p-3 h-100 see-more-card"
              onClick={() => navigate("/vendor/branches")}
            >
              <div className="text-center">
                <ArrowRight size={24} />
                <div className="fw-semibold mt-2">See All Branches</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddBranchModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchBranches}
      />
    </>
  );
}
