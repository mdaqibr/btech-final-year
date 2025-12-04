import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  updateEmployee,
  getCompanies,
  getBranches,
  getBuildings,
} from "../../../api/employee";

import {
  Building2,
  Landmark,
  Factory,
  User,
  IdCard,
  Loader2,
  XCircle,
} from "lucide-react";
import GreetingBlock from "../../../components/BasicDetailsHeader.jsx";

const Step4EmployeeInfo = ({ email, onNext }) => {
  const [form, setForm] = useState({
    full_name: "",
    company: "",
    branch: "",
    building: "",
    employee_code: "",
  });

  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [buildings, setBuildings] = useState([]);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getCompanies().then((d) => setCompanies(d.data || []));
  }, []);

  const handleCompanySelect = async (id) => {
    setForm({ ...form, company: id, branch: "", building: "" });
    const res = await getBranches(id);
    setBranches(res.data);
    setBuildings([]);
  };

  const handleBranchSelect = async (id) => {
    setForm({ ...form, branch: id, building: "" });
    const res = await getBuildings(id);
    setBuildings(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await updateEmployee({ email, ...form });
    setLoading(false);

    if (!res.success) {
      setMsg(res.message);
      return;
    }

    onNext();
  };

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <GreetingBlock
        title="Complete your profile"
        subtitle="Fill in your employee details to continue"
        email={email}
      />

      {msg && (
        <div className="alert alert-danger d-flex gap-2">
          <XCircle size={18} /> {msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <label className="form-label">Full Name</label>
        <div className="input-group mb-3">
          <span className="input-group-text bg-light"><User size={18} /></span>
          <input
            className="form-control"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
          />
        </div>

        {/* Company */}
        <label className="form-label">Company</label>
        <div className="input-group mb-3">
          <span className="input-group-text bg-light"><Building2 size={18} /></span>
          <select
            className="form-select"
            value={form.company}
            onChange={(e) => handleCompanySelect(e.target.value)}
            required
          >
            <option value="">Select company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Branch */}
        <label className="form-label">Branch</label>
        <div className="input-group mb-3">
          <span className="input-group-text bg-light"><Landmark size={18} /></span>
          <select
            className="form-select"
            value={form.branch}
            onChange={(e) => handleBranchSelect(e.target.value)}
            required
            disabled={!branches.length}
          >
            <option value="">Select branch</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.branch_name}
              </option>
            ))}
          </select>
        </div>

        {/* Building */}
        <label className="form-label">Building</label>
        <div className="input-group mb-3">
          <span className="input-group-text bg-light"><Factory size={18} /></span>
          <select
            className="form-select"
            value={form.building}
            onChange={(e) => setForm({ ...form, building: e.target.value })}
            required
            disabled={!buildings.length}
          >
            <option value="">Select building</option>
            {buildings.map((bd) => (
              <option key={bd.id} value={bd.id}>
                {bd.building_name}
              </option>
            ))}
          </select>
        </div>

        {/* Employee Code */}
        <label className="form-label">Employee Code</label>
        <div className="input-group mb-4">
          <span className="input-group-text bg-light"><IdCard size={18} /></span>
          <input
            className="form-control"
            value={form.employee_code}
            onChange={(e) => setForm({ ...form, employee_code: e.target.value })}
            required
          />
        </div>

        <button className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2">
          {loading && <Loader2 className="spin" size={18} />}
          Submit →
        </button>

        <style>{`
          .spin { animation: spin 0.8s linear infinite; }
          @keyframes spin { from{transform:rotate(0);} to{transform:rotate(360deg);} }
        `}</style>
      </form>
    </motion.div>
  );
};

export default Step4EmployeeInfo;