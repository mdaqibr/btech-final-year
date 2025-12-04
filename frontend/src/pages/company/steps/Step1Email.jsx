import React, { useState } from "react";
import { motion } from "framer-motion";
import { createUser } from "../../../api/company";
import AuthHeader from "../../../components/AuthHeader";
import AlreadyHaveAccount from "../../../components/AllreadyHaveAccount.jsx";
import { Loader2, XCircle, Mail, Globe } from "lucide-react";

const Step1Email = ({ onNext, setEmail, email, country, setCountry, theme }) => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const countries = [
    { code: "IN", name: "India", flag: "🇮🇳" },
    { code: "US", name: "USA", flag: "🇺🇸" },
    { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
  ];

  const showMessage = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      const res = await createUser(email);
      if (res.success) {
        onNext();
      } else {
        showMessage("error", res.message || "Unable to continue. Please try again.");
      }
    } catch (err) {
      showMessage("error", "Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="p-4"
    >
      <AuthHeader
        variant="company"
        theme={theme} // use theme for header styling
        purpose="create your Cafetero workspace"
      />

      {msg.text && (
        <div
          className={`alert round-shape py-2 px-3 mb-3 d-flex align-items-center gap-2`}
          style={{
            backgroundColor: msg.type === "error" ? "#FEE2E2" : "#D1FAE5",
            color: msg.type === "error" ? "#B91C1C" : "#065F46",
          }}
        >
          <XCircle size={16} />
          <span className="small">{msg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <label className="form-label fw-semibold" style={{ color: theme.text.body }}>
          Admin Email
        </label>
        <div className="input-group mb-3">
          <span className="input-group-text" style={{ backgroundColor: "#F3F4F6", color: theme.text.body }}>
            <Mail size={18} />
          </span>
          <input
            type="email"
            className="form-control"
            placeholder="admin@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              borderColor: theme.primary,
              color: theme.text.body,
            }}
          />
        </div>

        {/* Country */}
        <label className="form-label fw-semibold" style={{ color: theme.text.body }}>
          Company Registered In
        </label>
        <div className="input-group mb-4">
          <span className="input-group-text" style={{ backgroundColor: "#F3F4F6", color: theme.text.body }}>
            <Globe size={18} />
          </span>
          <select
            className="form-select"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ borderColor: theme.primary, color: theme.text.body }}
          >
            {countries.map((c) => (
              <option key={c.code} value={c.name}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn w-100 round-shape d-flex justify-content-center align-items-center gap-2"
          style={{
            backgroundColor: theme.primary,
            color: "#fff",
          }}
        >
          {loading ? <Loader2 size={18} className="spin" /> : "Continue →"}
        </button>
      </form>
      
      <AlreadyHaveAccount onLogin={() => navigate("/login")} />

      <style>{`
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
};

export default Step1Email;