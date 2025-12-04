import React, { useState } from "react";
import { motion } from "framer-motion";
import { addBranches } from "../../../api/company";
import { Plus, Trash2, Building2, MapPin, Loader2, CheckCircle } from "lucide-react";
import GreetingBlock from "../../../components/AddBranchesHeader.jsx";

const COUNTRY_LIST = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
];

const Step5Branches = ({ onSubmit, companyId }) => {
  const [branches, setBranches] = useState([
    {
      branch_name: "",
      address: "",
      city: "",
      state: "",
      country: "IN",
      buildings: [{ building_name: "", floor_count: "" }],
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 4000);
  };

  // ADD BRANCH
  const addBranch = () =>
    setBranches([
      ...branches,
      {
        branch_name: "",
        address: "",
        city: "",
        state: "",
        country: "IN",
        buildings: [{ building_name: "", floor_count: "" }],
      },
    ]);

  const removeBranch = (index) => {
    if (branches.length === 1) return;
    setBranches(branches.filter((_, i) => i !== index));
  };

  const addBuilding = (bi) => {
    const updated = [...branches];
    updated[bi].buildings.push({ building_name: "", floor_count: "" });
    setBranches(updated);
  };

  const removeBuilding = (bi, bli) => {
    const updated = [...branches];
    if (updated[bi].buildings.length === 1) return;
    updated[bi].buildings.splice(bli, 1);
    setBranches(updated);
  };

  const handleChange = (bi, field, value) => {
    const updated = [...branches];
    updated[bi][field] = value;
    setBranches(updated);
  };

  const handleBuildingChange = (bi, bli, field, value) => {
    const updated = [...branches];
    updated[bi].buildings[bli][field] = value;
    setBranches(updated);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      company_id: companyId,
      branches: branches.map((b) => ({
        branch_name: b.branch_name,
        address: b.address,
        city: b.city,
        state: b.state,
        country: b.country,
        buildings: b.buildings.map((bl) => ({
          building_name: bl.building_name,
          floor_count: bl.floor_count,
        })),
      })),
    };

    setLoading(true);
    const res = await addBranches(payload);
    setLoading(false);

    if (!res.success) {
      showMessage("error", res.message || "Something went wrong.");
      return;
    }

    showMessage("success", "Company registered successfully!");
    setTimeout(() => onSubmit(branches), 1200);
  };

  return (
    <motion.div
      key="step5"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      style={{ maxHeight: "85vh", overflowY: "auto", paddingRight: "5px" }}
    >
      <GreetingBlock email={null} />

      {/* UI Message */}
      {msg.text && (
        <div
          className={`alert round-shape py-2 px-3 mb-3 ${
            msg.type === "error" ? "alert-danger" : "alert-success"
          } d-flex align-items-center gap-2`}
        >
          {msg.type === "error" ? <Trash2 size={16} /> : <CheckCircle size={16} />}
          <span className="small">{msg.text}</span>
        </div>
      )}

      <form onSubmit={handleFinalSubmit}>
        {branches.map((b, bi) => (
          <div
            key={bi}
            className="border rounded-4 p-3 mb-4 shadow-sm bg-white position-relative"
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h6 className="fw-semibold d-flex align-items-center gap-2 m-0">
                <MapPin size={18} /> Branch {bi + 1}
              </h6>

              {branches.length > 1 && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                  onClick={() => removeBranch(bi)}
                >
                  <Trash2 size={15} /> Remove
                </button>
              )}
            </div>

            <input
              className="form-control mb-2"
              placeholder="Branch Name"
              value={b.branch_name}
              onChange={(e) => handleChange(bi, "branch_name", e.target.value)}
            />

            <textarea
              className="form-control mb-2 rounded-4"
              placeholder="Address"
              value={b.address}
              onChange={(e) => handleChange(bi, "address", e.target.value)}
            ></textarea>

            <div className="d-flex gap-2 mb-2">
              <input
                className="form-control"
                placeholder="City"
                value={b.city}
                onChange={(e) => handleChange(bi, "city", e.target.value)}
              />
              <input
                className="form-control"
                placeholder="State"
                value={b.state}
                onChange={(e) => handleChange(bi, "state", e.target.value)}
              />
            </div>

            <select
              className="form-select mb-2"
              value={b.country}
              onChange={(e) => handleChange(bi, "country", e.target.value)}
            >
              {COUNTRY_LIST.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>

            <hr />

            <h6 className="fw-semibold d-flex align-items-center gap-2 mb-3">
              <Building2 size={18} /> Buildings
            </h6>

            {b.buildings.map((bl, bli) => (
              <div key={bli} className="d-flex gap-2 mb-2">
                <input
                  className="form-control"
                  placeholder="Building Name"
                  value={bl.building_name}
                  onChange={(e) =>
                    handleBuildingChange(bi, bli, "building_name", e.target.value)
                  }
                />

                <input
                  className="form-control"
                  placeholder="Floors"
                  type="number"
                  value={bl.floor_count}
                  onChange={(e) =>
                    handleBuildingChange(bi, bli, "floor_count", e.target.value)
                  }
                />

                {b.buildings.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger d-flex align-items-center"
                    onClick={() => removeBuilding(bi, bli)}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline-primary btn-sm mt-1 d-flex align-items-center gap-1"
              onClick={() => addBuilding(bi)}
            >
              <Plus size={16} /> Add Building
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-outline-secondary w-100 mb-3 d-flex justify-content-center gap-2"
          onClick={addBranch}
        >
          <Plus size={18} /> Add Another Branch
        </button>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="spin" /> Saving...
            </>
          ) : (
            "Submit Company →"
          )}
        </button>
      </form>

      <style>
        {`
          .spin { animation: spin 0.8s linear infinite; }
          @keyframes spin { 
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </motion.div>
  );
};

export default Step5Branches;