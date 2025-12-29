import React, { useState } from "react";
import { X } from "lucide-react";
import { createBuilding } from "../../../api/buildings";

const AddBuildingModal = ({ branchId, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    branch: branchId,
    building_name: "",
    floor_count: 0,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");

    if (!form.building_name) {
      setError("Building name is required.");
      return;
    }

    setSaving(true);
    try {
      await createBuilding({
        branch: form.branch,
        building_name: form.building_name,
        floor_count: Number(form.floor_count),
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Could not create building. Try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0" style={{ borderRadius: "15px" }}>
          
          <div className="modal-header">
            <h5 className="modal-title fw-semibold">Add Building</h5>
            <button className="btn btn-light btn-sm" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="modal-body">

            {error && (
              <div className="alert alert-danger d-flex align-items-start gap-2">
                <i className="bi bi-exclamation-circle-fill"></i>
                {error}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label small fw-bold">Building Name</label>
              <input
                className="form-control"
                value={form.building_name}
                onChange={(e) =>
                  setForm({ ...form, building_name: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">Total Floors</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={form.floor_count}
                onChange={(e) =>
                  setForm({ ...form, floor_count: e.target.value })
                }
              />
              <div className="form-text">
                If more than 0, backend can auto-generate floors.
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={submit}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Building"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBuildingModal;
