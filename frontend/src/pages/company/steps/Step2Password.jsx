import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// API
import {
  setPassword as apiSetPassword,
  sendOTP as triggerOTP,
} from "../../../api/company";

// Lucide Icons
import { Eye, EyeOff, Loader2, XCircle } from "lucide-react";
import GreetingTitle from "../../../components/PasswordHeader";

const Step2Password = ({ email, onBack, onNext, setPassword, theme }) => {
  const [password, updatePassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const [validations, setValidations] = useState({
    length: false,
    alphabet: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    setValidations({
      length: password.length >= 8,
      alphabet: /[A-Za-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  }, [password]);

  const handleNext = async (e) => {
    e.preventDefault();

    if (!Object.values(validations).every(Boolean)) {
      setMsg({ type: "error", text: "Please fix all password requirements." });
      return;
    }

    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      setPassword(password);
      const res = await apiSetPassword(email, password);

      if (res.success) {
        await triggerOTP(email);
        onNext();
      } else {
        setMsg({ type: "error", text: res.message || "Something went wrong" });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Something went wrong" });
    }

    setLoading(false);
  };

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <GreetingTitle
        theme={theme}
        userType="Company Admin"
        purpose="Please create a secure password to continue with your registration."
      />

      {msg.text && (
        <div
          className="d-flex align-items-center gap-2 mb-3 p-2"
          style={{
            backgroundColor: msg.type === "error" ? "#FEE2E2" : "#D1FAE5",
            color: msg.type === "error" ? "#B91C1C" : "#065F46",
            borderRadius: "6px",
          }}
        >
          <XCircle size={16} />
          <span className="small">{msg.text}</span>
        </div>
      )}

      <p className="small" style={{ color: theme.text.body }}>
        <b>{email}</b>{" "}
        <button
          onClick={onBack}
          className="btn btn-link p-0 ms-1"
          style={{ color: theme.primary }}
        >
          Change
        </button>
      </p>

      <h4 className="fw-bold mb-3" style={{ color: theme.text.title }}>
        Create your password
      </h4>

      <form onSubmit={handleNext}>
        {/* Password Input */}
        <div className="input-group mb-3">
          <input
            type={show ? "text" : "password"}
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => updatePassword(e.target.value)}
            required
            style={{ borderColor: theme.primary, color: theme.text.body }}
          />
          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center"
            onClick={() => setShow(!show)}
            style={{ borderColor: theme.primary, color: theme.text.body }}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Validation List */}
        <ul className="list-unstyled small">
          <li style={{ color: validations.length ? "#16A34A" : theme.text.subtitle }}>
            ✓ Must include 8 characters
          </li>
          <li style={{ color: validations.alphabet ? "#16A34A" : theme.text.subtitle }}>
            ✓ Must include at least 1 alphabet
          </li>
          <li style={{ color: validations.number ? "#16A34A" : theme.text.subtitle }}>
            ✓ Must include a number
          </li>
          <li style={{ color: validations.special ? "#16A34A" : theme.text.subtitle }}>
            ✓ Must include a special character
          </li>
        </ul>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn w-100 mt-3 d-flex justify-content-center align-items-center gap-2"
          style={{ backgroundColor: theme.primary, color: "#fff" }}
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

      <style>{`
        .spin {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default Step2Password;