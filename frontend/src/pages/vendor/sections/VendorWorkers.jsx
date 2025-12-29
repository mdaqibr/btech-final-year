import {
  Plus,
  Pencil,
  Trash2,
  ArrowRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVendorWorkers, deleteVendorWorker } from "../../../api/vendor";
import AddWorkerModal from "./modals/AddWorkerModal";

export default function VendorWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const navigate = useNavigate();

  const fetchWorkers = () => {
    setLoading(true);
    getVendorWorkers()
      .then((res) => setWorkers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this worker?")) return;
    deleteVendorWorker(id).then(fetchWorkers);
  };

  const visibleWorkers = workers.slice(0, 3);
  const hasMore = workers.length > 3;

  return (
    <>
      <h5 className="fw-bold mb-3">Workers</h5>

      {loading && <div className="skeleton mb-3" style={{ height: 120 }} />}

      {!loading &&
        visibleWorkers.map((w) => {
          const isActive = w.is_active;

          return (
            <div key={w.id} className="vendor-card card border-0 mb-2 p-3">
              <div className="d-flex justify-content-between gap-3">
                {/* LEFT CONTENT */}
                <div className="d-flex flex-column overflow-hidden">
                  {/* NAME + STATUS */}
                  <div className="d-flex align-items-center gap-2 fw-semibold">
                    <span className="text-truncate">{w.name}</span>

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
                        flexShrink: 0,
                      }}
                      title={
                        isActive ? "Worker is active" : "Worker is inactive"
                      }
                    >
                      {isActive ? (
                        <CheckCircle size={12} />
                      ) : (
                        <XCircle size={12} />
                      )}
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* META INFO */}
                  <div className="text-muted small">
                    {w.role_display}
                    {w.phone && ` • ${w.phone}`}
                  </div>

                  <div className="text-muted small">
                    {w.branch_name} • {w.floor_name}
                  </div>

                  {w.pin_code && (
                    <div className="text-muted small">PIN: {w.pin_code}</div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="d-flex gap-2 flex-shrink-0">
                  <button
                    className="btn btn-light btn-sm"
                    title="Edit worker"
                    onClick={() => {
                      setSelectedWorker(w);
                      setShowModal(true);
                    }}
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    className="btn btn-light btn-sm text-danger"
                    title="Delete worker"
                    onClick={() => handleDelete(w.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

      {/* ADD WORKER – ALWAYS VISIBLE */}
      {!loading && (
        <div
          className="vendor-card card border-0 p-3 mb-2 cursor-pointer"
          onClick={() => {
            setSelectedWorker(null);
            setShowModal(true);
          }}
        >
          <div className="d-flex align-items-center gap-2 text-primary fw-semibold">
            <Plus size={16} />
            <span>Add Worker</span>
          </div>
        </div>
      )}

      {/* VIEW ALL – ONLY WHEN MORE THAN 3 */}
      {!loading && hasMore && (
        <div
          className="vendor-card card border-0 p-3 cursor-pointer"
          onClick={() => navigate("/vendor/workers")}
        >
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-semibold text-primary">
              View All Workers ({workers.length})
            </span>
            <ArrowRight size={16} />
          </div>
        </div>
      )}

      {/* MODAL */}
      <AddWorkerModal
        show={showModal}
        worker={selectedWorker}
        onClose={() => {
          setShowModal(false);
          setSelectedWorker(null);
        }}
        onSuccess={fetchWorkers}
      />
    </>
  );
}
