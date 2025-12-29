// src/pages/vendor/WorkersPage.jsx
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getVendorWorkers, deleteVendorWorker } from "../../api/vendor";
import AddWorkerModal from "./sections/modals/AddWorkerModal";

export default function WorkersPage() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

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

  return (
    <div className="container">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h4 className="fw-bold mb-1">Workers</h4>
          <p className="text-muted mb-0">Manage staff and assign floors.</p>
        </div>

        <button
          className="btn btn-primary btn-sm d-flex align-items-center gap-1"
          onClick={() => {
            setSelectedWorker(null);
            setShowModal(true);
          }}
        >
          <Plus size={16} />
          Add Worker
        </button>
      </div>

      {/* LOADING */}
      {loading && <div className="skeleton" style={{ height: 200 }} />}

      {/* LIST */}
      {!loading &&
        workers.map((w) => {
          const isActive = w.is_active;

          return (
            <div key={w.id} className="vendor-card card border-0 mb-2 p-3">
              <div className="d-flex justify-content-between gap-3">
                {/* LEFT */}
                <div className="d-flex flex-column overflow-hidden">
                  {/* NAME + STATUS */}
                  <div className="d-flex align-items-center gap-2 fw-semibold">
                    <span className="text-truncate">{w.name}</span>

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

                  {/* ROLE + PHONE */}
                  <div className="text-muted small">
                    {w.role_display}
                    {w.phone && ` • ${w.phone}`}
                  </div>

                  {/* BRANCH + FLOOR */}
                  <div className="text-muted small">
                    {w.branch_name} • {w.floor_name}
                  </div>

                  {/* PIN */}
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
    </div>
  );
}
