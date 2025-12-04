// src/pages/vendor/steps/VStep2Password.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { setPassword as apiSetPassword, sendOTP } from "../../../api/vendor";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import GreetingTitle from "../../../components/PasswordHeader";

const VStep2Password = ({ email, onBack, onNext, setPassword }) => {
  const [password, updatePassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [validations, setValidations] = useState({
    length: false, alphabet: false, number: false, special: false,
  });

  useEffect(()=> {
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
        await sendOTP(email);
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
    <motion.div key="vstep2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
      <GreetingTitle
        userType="Vendor Partner"
        purpose="Create a strong password to access your vendor portal."
      />

      <p className="text-muted small"><b>{email}</b> <button onClick={onBack} className="btn btn-link p-0 ms-1">Change</button></p>
      <h4 className="fw-bold mb-3">Create password</h4>

      <form onSubmit={handleNext}>
        <div className="input-group mb-3">
          <input type={show ? "text" : "password"} className="form-control rounded-start-round-shape" placeholder="Enter password" value={password} onChange={(e)=>updatePassword(e.target.value)} required />
          <button type="button" className="btn btn-outline-secondary rounded-end-round-shape" onClick={()=>setShow(!show)}>
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <ul className="list-unstyled small mb-3">
          <li className={validations.length ? "text-success" : "text-muted"}>✓ at least 8 characters</li>
          <li className={validations.alphabet ? "text-success" : "text-muted"}>✓ at least 1 alphabet</li>
          <li className={validations.number ? "text-success" : "text-muted"}>✓ a number</li>
          <li className={validations.special ? "text-success" : "text-muted"}>✓ a special character</li>
        </ul>

        <button type="submit" disabled={loading} className="btn btn-purple w-100 round-shape d-flex justify-content-center gap-2">
          {loading ? (<><Loader2 size={16} className="spin" /> Processing...</>) : "Continue →"}
        </button>
      </form>

      <style>{`.spin { animation: spin 0.8s linear infinite; } @keyframes spin { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }`}</style>
    </motion.div>
  );
};

export default VStep2Password;