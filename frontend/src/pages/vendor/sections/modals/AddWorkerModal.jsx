// src/pages/vendor/sections/modals/AddWorkerModal.jsx
import { useEffect, useState } from "react";
import {
  createVendorWorkers,
  updateVendorWorker,
  getVendorBranches,
  getApprovedFloors,
} from "../../../../api/vendor";

const ROLES = ["Manager", "Worker", "Delivery"];

export default function AddWorkerModal({ show, worker, onClose, onSuccess }) {
  const [branches, setBranches] = useState([]);
  const [floors, setFloors] = useState([]);
  const [form, setForm] = useState({
    vendor_branch: "",
    company_floor: "",
    name: "",
    phone: "",
    role: "Worker",
    pin_code: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      getVendorBranches().then((r) => setBranches(r.data));
      getApprovedFloors().then((r) => setFloors(r.data));

      if (worker) {
        setForm({
          vendor_branch: worker.vendor_branch,
          company_floor: worker.company_floor,
          name: worker.name,
          phone: worker.phone || "",
          role: worker.role,
          pin_code: worker.pin_code || "",
          is_active: worker.is_active,
        });
      }
    }
  }, [show, worker]);

  if (!show) return null;

  const submit = () => {
    setLoading(true);
    setError("");

    const apiCall = worker
      ? updateVendorWorker(worker.id, form)
      : createVendorWorkers(form);

    apiCall
      .then(() => {
        onSuccess?.();
        setTimeout(onClose, 500);
      })
      .catch(() => setError("Something went wrong"))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="modal-backdrop fade show" />

      <div className="modal fade show" style={{ display: "block" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header">
              <h5 className="fw-bold">
                {worker ? "Edit Worker" : "Add Worker"}
              </h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger py-2 small">{error}</div>
              )}

              {/* ACTIVE STATUS */}
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isActiveSwitch"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                />
                <label
                  className="form-check-label fw-semibold"
                  htmlFor="isActiveSwitch"
                >
                  Active Worker
                </label>
              </div>

              <label className="form-label">Branch</label>
              <select
                className="form-select mb-2"
                value={form.vendor_branch}
                onChange={(e) =>
                  setForm({ ...form, vendor_branch: e.target.value })
                }
              >
                <option value="">Select branch</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.branch_name}
                  </option>
                ))}
              </select>

              <label className="form-label">Company Floor</label>
              <select
                className="form-select mb-2 select2"
                value={form.company_floor}
                onChange={(e) =>
                  setForm({ ...form, company_floor: Number(e.target.value) })
                }
              >
                <option value="">Select floor</option>
                {floors.map((f) => (
                  <option key={f.floor_id} value={f.floor_id}>
                    {f.company_name} — {f.building_name} — {f.floor_name}
                  </option>
                ))}
              </select>

              <input
                className="form-control mb-2"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                className="form-control mb-2"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <select
                className="form-select mb-2"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>

              <input
                className="form-control mb-2"
                placeholder="PIN Code"
                value={form.pin_code}
                onChange={(e) => setForm({ ...form, pin_code: e.target.value })}
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-light btn-sm" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                disabled={loading}
                onClick={submit}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
