import {
  Plus,
  Pencil,
  Trash2,
  MapPin,
  ChevronRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVendorBranches, deleteVendorBranch } from "../../api/vendor";
import AddBranchModal from "./shared/AddBranchModal";

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const navigate = useNavigate();

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await getVendorBranches();
      setBranches(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this branch?")) return;
    await deleteVendorBranch(id);
    fetchBranches();
  };

  return (
    <div className="container">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h4 className="fw-bold mb-1">Branches</h4>
          <p className="text-muted mb-0">Manage your business locations.</p>
        </div>

        <button
          className="btn btn-primary btn-sm d-flex align-items-center gap-1"
          onClick={() => {
            setSelectedBranch(null);
            setShowModal(true);
          }}
        >
          <Plus size={16} />
          Add Branch
        </button>
      </div>

      {loading && <div className="skeleton" style={{ height: 200 }} />}

      {!loading && branches.length === 0 && (
        <div className="text-muted">No branches added yet.</div>
      )}

      {!loading &&
        branches.map((b) => {
          const isActive = b.is_active ?? true;

          return (
            <div key={b.id} className="vendor-card card border-0 mb-2 p-3">
              <div className="d-flex justify-content-between align-items-center gap-3">
                {/* LEFT */}
                <div className="d-flex flex-column overflow-hidden">
                  <div className="d-flex align-items-center gap-2 fw-semibold">
                    <span className="text-truncate">{b.branch_name}</span>

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

                  <div className="text-muted small d-flex align-items-center gap-1">
                    <MapPin size={14} />
                    {b.city}, {b.state}
                  </div>

                  {b.address && (
                    <div className="text-muted small">{b.address}</div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="d-flex gap-2 align-items-center flex-shrink-0">
                  <button
                    className="btn btn-light btn-sm"
                    title="Edit branch"
                    onClick={() => {
                      setSelectedBranch(b);
                      setShowModal(true);
                    }}
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    className="btn btn-light btn-sm text-danger"
                    title="Delete branch"
                    onClick={() => handleDelete(b.id)}
                  >
                    <Trash2 size={14} />
                  </button>

                  <button
                    className="btn btn-light btn-sm"
                    title="Open Branch"
                    onClick={() => navigate(`/vendor/branches/${b.id}`)}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

      <AddBranchModal
        show={showModal}
        branch={selectedBranch}
        onClose={() => {
          setShowModal(false);
          setSelectedBranch(null);
        }}
        onSuccess={fetchBranches}
      />
    </div>
  );
}
