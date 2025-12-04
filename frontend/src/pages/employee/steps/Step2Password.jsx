import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { setEmployeePassword, sendOTP } from "../../../api/employee";
import { Loader2, XCircle, Lock, Eye, EyeOff } from "lucide-react";
import GreetingTitle from "../../../components/PasswordHeader";

const Step2Password = ({ email, setPassword, onNext, onBack }) => {
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [validations, setValidations] = useState({
    length: false,
    alphabet: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    setValidations({
      length: pwd.length >= 8,
      alphabet: /[A-Za-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    });
  }, [pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Object.values(validations).every(Boolean)) return;

    setLoading(true);
    setMsg("");

    try {
      // 1️⃣ Set Password
      const res = await setEmployeePassword(email, pwd);

      if (!res.success) {
        setMsg(res.message);
        setLoading(false);
        return;
      }

      setPassword(pwd);

      // 2️⃣ Send OTP (same as vendor)
      const otpRes = await sendOTP(email);

      if (!otpRes.success) {
        setMsg(otpRes.message || "Failed to send OTP");
        setLoading(false);
        return;
      }

      // 3️⃣ Move to next step (OTP page)
      onNext();

    } catch (err) {
      setMsg("Something went wrong. Try again.");
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
        userType="Employee"
        purpose="Create a secure password to continue."
      />

      {/* CHANGE EMAIL */}
      <p className="text-muted small mt-1">
        <b>{email}</b>
        <button
          type="button"
          className="btn btn-link p-0 ms-2"
          onClick={onBack}
        >
          Change email
        </button>
      </p>

      {msg && (
        <div className="alert alert-danger d-flex gap-2">
          <XCircle size={18} /> {msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="form-label fw-semibold">Password</label>

        <div className="input-group mb-3">
          <span className="input-group-text bg-light">
            <Lock size={18} />
          </span>

          <input
            type={show ? "text" : "password"}
            className="form-control"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
            placeholder="Create your password"
          />

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShow(!show)}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* PASSWORD RULES */}
        <ul className="list-unstyled small mb-3">
          <li className={validations.length ? "text-success" : "text-muted"}>
            ✓ At least 8 characters
          </li>
          <li className={validations.alphabet ? "text-success" : "text-muted"}>
            ✓ Contains an alphabet
          </li>
          <li className={validations.number ? "text-success" : "text-muted"}>
            ✓ Contains a number
          </li>
          <li className={validations.special ? "text-success" : "text-muted"}>
            ✓ Contains a special character
          </li>
        </ul>

        <button
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
          disabled={loading}
        >
          {loading && <Loader2 size={18} className="spin" />}
          Continue →
        </button>
      </form>

      <style>{`
        .spin {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default Step2Password;