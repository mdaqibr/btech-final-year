import React, { useState } from "react";
import { motion } from "framer-motion";
import { createEmployeeUser } from "../../../api/employee";
import AuthHeader from "../../../components/AuthHeader";
import AlreadyHaveAccount from "../../../components/AllreadyHaveAccount.jsx";
import { Loader2, XCircle, Mail } from "lucide-react";

const Step1Email = ({ email, setEmail, onNext }) => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const res = await createEmployeeUser(email);
    setLoading(false);

    if (!res.success) return setMsg(res.message);
    onNext();
  };

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <AuthHeader
        variant="employee"
        userType="employee"
        purpose="access your company dashboard"
      />

      {msg && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2">
          <XCircle size={18} /> {msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="form-label fw-semibold">Work Email</label>
        <div className="input-group mb-4">
          <span className="input-group-text bg-light">
            <Mail size={18} />
          </span>
          <input
            type="email"
            className="form-control"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
          {loading && <Loader2 className="spin" size={18} />}
          Continue →
        </button>

        <style>{`
          .spin { animation: spin 0.8s linear infinite; }
          @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        `}</style>
      </form>
      <AlreadyHaveAccount onLogin={() => navigate("/login")} />
    </motion.div>
  );
};

export default Step1Email;