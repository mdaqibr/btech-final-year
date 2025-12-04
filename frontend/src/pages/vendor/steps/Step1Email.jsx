import React, { useState } from "react";
import { motion } from "framer-motion";
import { createVendorUser } from "../../../api/vendor";
import AuthHeader from "../../../components/AuthHeader";
import AlreadyHaveAccount from "../../../components/AllreadyHaveAccount.jsx";
import { Loader2, Mail, Globe, XCircle } from "lucide-react";

const VStep1Email = ({ onNext, setEmail, email, country, setCountry }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const countries = [
    { code: "IN", name: "India", flag: "🇮🇳" },
    { code: "US", name: "USA", flag: "🇺🇸" },
    { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const res = await createVendorUser(email);
      if (res.success) {
        onNext();
      } else {
        setError(res.message || "Unable to process your request.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <motion.div
      key="vstep1"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="p-3"
    >
      <AuthHeader
        variant="vendor"
        userType="vendor"
        purpose="get onboarded as Cafetero partner"
      />

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2">
          <XCircle size={18} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <label className="form-label fw-semibold">Vendor Email</label>
        <div className="input-group mb-3">
          <span className="input-group-text bg-light">
            <Mail size={18} />
          </span>
          <input
            type="email"
            className="form-control"
            placeholder="vendor@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Country */}
        <label className="form-label fw-semibold">Operating Country</label>
        <div className="input-group mb-4">
          <span className="input-group-text bg-light">
            <Globe size={18} />
          </span>
          <select
            className="form-select"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
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
          disabled={loading}
          className="btn btn-purple w-100 d-flex justify-content-center align-items-center gap-2"
        >
          {loading ? <Loader2 size={16} className="spin" /> : "Continue →"}
        </button>

        <style>{`
          .spin { animation: spin 0.8s linear infinite; }
        `}</style>
      </form>
      <AlreadyHaveAccount onLogin={() => navigate("/login")} />
    </motion.div>
  );
};

export default VStep1Email;