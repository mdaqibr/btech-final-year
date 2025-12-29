import { useEffect, useState } from "react";
import { createVendorBranch, updateVendorBranch } from "../../../api/vendor";

const countries = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "US", name: "USA", flag: "🇺🇸" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
];

const emptyForm = {
  branch_name: "",
  city: "",
  state: "",
  country: "IN",
  address: "",
};

export default function AddBranchModal({ show, onClose, onSuccess, branch }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- PREFILL ON EDIT ---------------- */
  useEffect(() => {
    if (branch) {
      setForm({
        branch_name: branch.branch_name || "",
        city: branch.city || "",
        state: branch.state || "",
        country: branch.country || "IN",
        address: branch.address || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [branch, show]);

  if (!show) return null;

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const newErrors = {};
    if (!form.branch_name.trim())
      newErrors.branch_name = "Branch name is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const submit = () => {
    setApiError("");
    if (!validate()) return;

    setLoading(true);

    const apiCall = branch
      ? updateVendorBranch(branch.id, form)
      : createVendorBranch(form);

    apiCall
      .then(() => {
        onSuccess();
        onClose();
      })
      .catch((err) => {
        setApiError(
          err.response?.data?.detail ||
            err.response?.data?.non_field_errors?.[0] ||
            "Something went wrong"
        );
      })
      .finally(() => setLoading(false));
  };

  const inputClass = (f) => `form-control ${errors[f] ? "is-invalid" : ""}`;

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div className="modal fade show" style={{ display: "block" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">
                {branch ? "Edit Vendor Branch" : "Add Vendor Branch"}
              </h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {apiError && (
                <div className="alert alert-danger py-2 small">{apiError}</div>
              )}

              {["branch_name", "city", "state"].map((f) => (
                <div className="mb-3" key={f}>
                  <label className="form-label fw-semibold text-capitalize">
                    {f.replace("_", " ")} *
                  </label>
                  <input
                    className={inputClass(f)}
                    value={form[f]}
                    onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  />
                  <div className="invalid-feedback">{errors[f]}</div>
                </div>
              ))}

              <div className="mb-3">
                <label className="form-label fw-semibold">Country *</label>
                <select
                  className={`form-select ${
                    errors.country ? "is-invalid" : ""
                  }`}
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Address *</label>
                <textarea
                  className={inputClass("address")}
                  rows="3"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-light btn-sm" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={submit}
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : branch
                  ? "Update Branch"
                  : "Add Branch"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
