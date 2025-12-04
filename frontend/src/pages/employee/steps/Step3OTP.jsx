// src/pages/employee/steps/Step3OTP.jsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { sendOTP, verifyOTP } from "../../../api/employee";
import { Loader2 } from "lucide-react";
import GreetingBlock from "../../../components/OtpHeader.jsx";

const Step3OTP = ({ email, onBack, onNext }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const inputsRef = useRef([]);

  const showMessage = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 4000);
  };

  // AUTO MOVE FOCUS
  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // BACKSPACE HANDLER
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // VERIFY OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      showMessage("error", "Enter all 6 digits");
      return;
    }

    setLoading(true);
    const res = await verifyOTP(email, finalOtp);
    setLoading(false);

    if (!res.success) {
      showMessage("error", res.message || "Invalid OTP");
      return;
    }

    onNext();
  };

  // RESEND OTP
  const handleResend = async () => {
    setLoading(true);
    const res = await sendOTP(email);
    setLoading(false);

    if (!res.success) {
      showMessage("error", res.message || "Unable to resend");
      return;
    }

    showMessage("success", "OTP sent again");
  };

  return (
    <motion.div key="estep3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
      <GreetingBlock email={email} onBack={onBack} />

      {msg.text && (
        <div
          className={`alert ${
            msg.type === "error" ? "alert-danger" : "alert-success"
          } alert-round-shape mb-3`}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={handleVerify} className="text-center">

        {/* OTP BOXES */}
        <div className="d-flex justify-content-center gap-2 mb-4">
          {otp.map((v, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={v}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              maxLength={1}
              className="form-control text-center fw-bold"
              style={{ width: 45, fontSize: 18 }}
            />
          ))}
        </div>

        {/* RESEND */}
        <button
          type="button"
          disabled={loading}
          className="btn btn-link mb-2"
          onClick={handleResend}
        >
          {loading ? <Loader2 size={14} className="spin" /> : "Resend OTP"}
        </button>

        {/* VERIFY */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-100 d-flex justify-content-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="spin" /> Verifying...
            </>
          ) : (
            "Verify →"
          )}
        </button>
      </form>

      <style>{`
        .spin {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0) }
          100% { transform: rotate(360deg) }
        }
      `}</style>
    </motion.div>
  );
};

export default Step3OTP;