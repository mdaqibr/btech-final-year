// src/pages/vendor/steps/VStep3OTP.jsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { verifyOTP, sendOTP } from "../../../api/vendor";
import { Loader2, XCircle } from "lucide-react";
import GreetingBlock from "../../../components/OtpHeader.jsx";

const VStep3OTP = ({ email, onBack, onNext }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const inputsRef = useRef([]);

  const showMessage = (type, text) => {
    setMsg({ type, text });
    setTimeout(()=> setMsg({ type: "", text: "" }), 4000);
  };

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) inputsRef.current[index+1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputsRef.current[index-1]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) { showMessage("error","Enter all 6 digits"); return; }
    setLoading(true);
    const res = await verifyOTP(email, finalOtp);
    setLoading(false);
    if (!res.success) { showMessage("error", res.message || "Invalid OTP"); return; }
    onNext();
  };

  const handleResend = async () => {
    setLoading(true);
    const res = await sendOTP(email);
    setLoading(false);
    if (!res.success) { showMessage("error", res.message || "Unable to resend"); return; }
    showMessage("success","OTP sent");
  };

  return (
    <motion.div key="vstep3" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}>
      <GreetingBlock email={email} onBack={onBack} />

      {msg.text && (<div className={`alert ${msg.type === "error" ? "alert-danger" : "alert-success"} alert-round-shape mb-3`}>{msg.text}</div>)}

      <form onSubmit={handleVerify} className="text-center">
        <div className="d-flex justify-content-center gap-2 mb-3">
          {otp.map((v,i)=> (
            <input key={i} ref={el => inputsRef.current[i] = el} value={v} onChange={(e)=>handleChange(i,e.target.value)} onKeyDown={(e)=>handleKeyDown(i,e)} maxLength={1} className="form-control text-center fw-bold" style={{width:45,fontSize:18}}/>
          ))}
        </div>

        <button type="button" disabled={loading} className="btn btn-link mb-2" onClick={handleResend}>
          {loading ? <Loader2 size={14} className="spin" /> : "Resend OTP"}
        </button>

        <button type="submit" disabled={loading} className="btn btn-purple w-100 round-shape">
          {loading ? (<><Loader2 size={16} className="spin" /> Verifying...</>) : "Verify →"}
        </button>
      </form>

      <style>{`.spin{animation:spin .8s linear infinite} @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </motion.div>
  );
};

export default VStep3OTP;