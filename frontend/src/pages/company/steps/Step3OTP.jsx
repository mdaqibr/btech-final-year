import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { verifyOTP, sendOTP } from "../../../api/company";
import { Loader2, XCircle } from "lucide-react";
import GreetingBlock from "../../../components/OtpHeader.jsx";

const Step3OTP = ({ email, onBack, onNext, theme }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const inputsRef = useRef([]);

  const showMessage = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 4000);
  };

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      showMessage("error", "Please enter all 6 digits");
      return;
    }

    setLoading(true);
    const res = await verifyOTP(email, finalOtp);
    setLoading(false);

    if (!res.success) {
      showMessage("error", res.message || "Invalid OTP. Try again.");
      return;
    }

    onNext();
  };

  const handleResend = async () => {
    setLoading(true);
    const res = await sendOTP(email);
    setLoading(false);

    if (!res.success) {
      showMessage("error", res.message || "Unable to resend OTP");
      return;
    }

    showMessage("success", "OTP sent successfully!");
  };

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <GreetingBlock email={email} onBack={onBack} theme={theme} />

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

      <form onSubmit={handleVerify} className="text-center">
        <div className="d-flex justify-content-center gap-2 mb-3">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              value={value}
              ref={(el) => (inputsRef.current[index] = el)}
              maxLength={1}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="form-control text-center fw-bold"
              style={{
                width: "45px",
                fontSize: "1.2rem",
                borderColor: theme.primary,
                color: theme.text.body,
              }}
            />
          ))}
        </div>

        {/* RESEND OTP */}
        <button
          type="button"
          disabled={loading}
          onClick={handleResend}
          className="btn d-flex align-items-center gap-1 mx-auto mb-3"
          style={{ color: theme.primary }}
        >
          {loading && <Loader2 size={16} className="spin" />}
          Resend OTP
        </button>

        {/* VERIFY BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="btn w-100 d-flex justify-content-center align-items-center gap-2"
          style={{ backgroundColor: theme.primary, color: "#fff" }}
        >
          {loading ? <Loader2 size={18} className="spin" /> : "Verify →"}
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

export default Step3OTP;