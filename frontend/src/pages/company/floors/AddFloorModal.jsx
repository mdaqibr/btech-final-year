import React, { useState } from "react";
import { X } from "lucide-react";
import { createFloor } from "../../../api/floors";

const AddFloorModal = ({ branchId, buildingId, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    building: buildingId,
    floor_name: "",
    floor_number: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");

    if (!form.floor_name || form.floor_number === "") {
      return setError("Floor name and number are required.");
    }

    setSaving(true);
    try {
      await createFloor(branchId, {
        building: form.building,
        floor_name: form.floor_name,
        floor_number: Number(form.floor_number),
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Failed to add floor. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-top">
        <div className="modal-content shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title">Add Floor</h5>
            <button className="btn btn-sm btn-light" onClick={onClose}>
              <X />
            </button>
          </div>

          <div className="modal-body">
            {/* Inline Error Message */}
            {error && <div className="alert alert-danger py-2">{error}</div>}

            <div className="mb-2">
              <label className="form-label small">Floor Name</label>
              <input
                className="form-control"
                value={form.floor_name}
                onChange={(e) =>
                  setForm({ ...form, floor_name: e.target.value })
                }
              />
            </div>

            <div className="mb-2">
              <label className="form-label small">Floor Number</label>
              <input
                type="number"
                className="form-control"
                value={form.floor_number}
                onChange={(e) =>
                  setForm({ ...form, floor_number: e.target.value })
                }
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-outline-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={submit}
              disabled={saving}
            >
              {saving ? "Adding..." : "Add Floor"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFloorModal;
