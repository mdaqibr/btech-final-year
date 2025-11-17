import React, { useState } from "react";
import { motion } from "framer-motion";
import { createUser } from "../../../api/company";

// Lucide Icons
import { Loader2 } from "lucide-react";

const Step1Email = ({ onNext, setEmail, email, country, setCountry }) => {
  const [loading, setLoading] = useState(false);

  const countries = [
    { code: "IN", name: "India", flag: "🇮🇳" },
    { code: "US", name: "USA", flag: "🇺🇸" },
    { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    try {
      const res = await createUser(email);
      if (res.success) {
        onNext();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="p-4"
    >
      <h3 className="fw-bold mb-3">Welcome to Cafetero</h3>
      <p className="text-muted mb-4">Get started with your email</p>

      <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input
            type="email"
            className="form-control rounded-pill"
            placeholder="Enter your company admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Country Dropdown */}
        <div className="mb-4">
          <label className="form-label fw-semibold">
            Where your company is registered
          </label>
          <select
            className="form-select rounded-pill"
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

        {/* Continue Button With Loader */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-100 rounded-pill d-flex justify-content-center align-items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="spin" />
              Processing...
            </>
          ) : (
            <>Continue →</>
          )}
        </button>
      </form>

      {/* Spinner CSS */}
      <style>{`
        .spin {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default Step1Email;
