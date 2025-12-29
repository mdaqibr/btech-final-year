// src/pages/company/branches/AddBranchModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { createBranch } from "../../../api/branches";

const AddBranchModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    branch_name: "",
    address: "",
    city: "",
    state: "",
    country: "IN",
  });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.branch_name || !form.city) return alert("Branch name & city required");
    setSaving(true);
    try {
      // your backend may expect company_id + branches list - adapt accordingly
      await createBranch({
        company_id: form.company_id, // optional; if backend requires company id otherwise skip
        branches: [
          {
            branch_name: form.branch_name,
            address: form.address,
            city: form.city,
            state: form.state,
            country: form.country,
          },
        ],
      });
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to create branch");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title">Add Branch</h5>
            <button type="button" className="btn btn-sm btn-light" onClick={onClose}><X /></button>
          </div>

          <div className="modal-body">
            <div className="mb-2">
              <label className="form-label small">Branch Name</label>
              <input className="form-control" value={form.branch_name} onChange={(e) => setForm({...form, branch_name: e.target.value})} />
            </div>

            <div className="mb-2">
              <label className="form-label small">Address</label>
              <textarea className="form-control" rows={3} value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} />
            </div>

            <div className="row g-2">
              <div className="col">
                <label className="form-label small">City</label>
                <input className="form-control" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} />
              </div>
              <div className="col">
                <label className="form-label small">State</label>
                <input className="form-control" value={form.state} onChange={(e) => setForm({...form, state: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving ? "Saving..." : "Save Branch"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBranchModal;