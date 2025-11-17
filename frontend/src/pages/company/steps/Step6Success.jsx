import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Store } from "lucide-react";

const Step6Success = () => {
  return (
    <motion.div
      key="step6"
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="text-center"
    >
      <CheckCircle
        size={80}
        className="text-success mb-3"
        style={{ animation: "pop 0.5s ease-in-out" }}
      />

      <h2 className="fw-bold mb-2">Registration Successful! 🎉</h2>
      <p className="text-muted mb-4">
        Welcome to <b>Cafetero</b> — your company is now ready.<br />
        Start managing employees, vendors, and branches effortlessly.
      </p>

      <div className="d-flex flex-column gap-3 mt-3">
        <a href="/dashboard" className="btn btn-primary rounded-pill w-100 d-flex align-items-center justify-content-center gap-2">
          Go to Dashboard <ArrowRight size={18} />
        </a>

        <a href="/vendors" className="btn btn-outline-primary rounded-pill w-100 d-flex align-items-center justify-content-center gap-2">
          Find Vendors for Your Organization <Store size={18} />
        </a>
      </div>

      <style>{`
        @keyframes pop {
          0% { transform: scale(0.3); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </motion.div>
  );
};

export default Step6Success;