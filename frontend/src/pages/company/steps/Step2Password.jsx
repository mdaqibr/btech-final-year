import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// API
import {
  setPassword as apiSetPassword,
  sendOTP as triggerOTP,
} from "../../../api/company";

// Lucide Icons
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Step2Password = ({ email, onBack, onNext, setPassword }) => {
  const [password, updatePassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (!Object.values(validations).every(Boolean)) return;

    setLoading(true);

    try {
      setPassword(password);
      const res = await apiSetPassword(email, password);

      if (res.success) {
        await triggerOTP(email);
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
      key="step2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-muted small">
        <b>{email}</b>{" "}
        <button onClick={onBack} className="btn btn-link p-0 ms-1">
          Change
        </button>
      </p>

      <h4 className="fw-bold mb-3">Create a password</h4>

      <form onSubmit={handleNext}>
        {/* Password Input */}
        <div className="input-group mb-3">
          <input
            type={show ? "text" : "password"}
            className="form-control rounded-start-pill"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => updatePassword(e.target.value)}
            required
          />

          <button
            type="button"
            className="btn btn-outline-secondary rounded-end-pill d-flex align-items-center"
            onClick={() => setShow(!show)}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Validation List */}
        <ul className="list-unstyled small">
          <li className={validations.length ? "text-success" : "text-muted"}>
            ✓ Must include 8 characters
          </li>
          <li className={validations.alphabet ? "text-success" : "text-muted"}>
            ✓ Must include at least 1 alphabet
          </li>
          <li className={validations.number ? "text-success" : "text-muted"}>
            ✓ Must include a number
          </li>
          <li className={validations.special ? "text-success" : "text-muted"}>
            ✓ Must include a special character
          </li>
        </ul>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-100 rounded-pill mt-3 d-flex justify-content-center align-items-center gap-2"
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
