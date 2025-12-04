// src/pages/vendor/steps/VStep6Success.jsx
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Users } from "lucide-react";

const VStep6Success = () => {
  return (
    <motion.div
      key="vstep6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="text-center"
      style={{ fontFamily: "Inter, sans-serif" }}
    >

      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <CheckCircle size={90} className="text-success mb-4 success-icon" />
      </motion.div>

      {/* Heading */}
      <motion.h2
        className="fw-bold mb-3"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ fontSize: "2rem", letterSpacing: "0.5px" }}
      >
        Welcome aboard!
      </motion.h2>

      {/* Subtext */}
      <motion.p
        className="text-muted mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        style={{ fontSize: "1rem", lineHeight: "1.6" }}
      >
        Your vendor account has been created.<br />
        Start listing branches, add menus and connect to companies.
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="d-flex flex-column gap-3 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.6 }}
      >
        <a
          href="/vendor/dashboard"
          className="btn btn-purple round-shape w-100 d-flex align-items-center justify-content-center gap-2 shadow-sm btn-animate"
        >
          Go to Dashboard <ArrowRight size={18} />
        </a>

        <a
          href="/companies"
          className="btn btn-outline-purple round-shape w-100 d-flex align-items-center justify-content-center gap-2 btn-animate"
        >
          Find Companies to Serve <Users size={18} />
        </a>
      </motion.div>

      {/* Extra Animations */}
      <style>{`
        .success-icon {
          animation: iconPulse 1.8s ease-in-out infinite;
        }

        @keyframes iconPulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 0px #28a745); }
          50% { transform: scale(1.08); filter: drop-shadow(0 0 8px #28a745); }
          100% { transform: scale(1); filter: drop-shadow(0 0 0px #28a745); }
        }

        .btn-animate {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .btn-animate:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.12);
        }
      `}</style>
    </motion.div>
  );
};

export default VStep6Success;
