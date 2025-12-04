import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";

const Step6Success = ({ theme }) => {
  // fallback if theme not passed
  const primary = theme?.primary || "#1E90FF"; // default company blue
  const gradientStart = primary;
  const gradientEnd = theme?.accent || "#85e085"; // fallback accent

  return (
    <motion.div
      key="company-success"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="text-center"
      style={{ fontFamily: "Inter, sans-serif", padding: "2rem" }}
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <CheckCircle
          size={90}
          className="success-icon mb-4"
          style={{ color: primary }}
        />
      </motion.div>

      {/* Heading */}
      <motion.h2
        className="fw-bold mb-3 gradient-text"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ fontSize: "2rem", letterSpacing: "0.5px" }}
      >
        Welcome aboard!
      </motion.h2>

      {/* Subtext */}
      <motion.p
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        style={{ fontSize: "1rem", lineHeight: "1.6", color: theme?.text?.body || "#374151" }}
      >
        Your company account has been created successfully.<br />
        You can now manage employees, vendors, and branches seamlessly.
      </motion.p>

      {/* Login Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.6 }}
      >
        <a
          href="/login"
          className="btn-gradient d-flex align-items-center justify-content-center gap-2"
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "50px",
            fontWeight: 600,
            fontSize: "1rem",
            background: `linear-gradient(90deg, ${gradientStart}, ${gradientEnd})`,
            color: "#fff",
            textDecoration: "none",
          }}
        >
          Login <ArrowRight size={18} />
        </a>
      </motion.div>

      {/* Animations & Styles */}
      <style>{`
        .success-icon {
          animation: iconPulse 1.8s ease-in-out infinite;
        }
        @keyframes iconPulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 0px ${primary}); }
          50% { transform: scale(1.08); filter: drop-shadow(0 0 12px ${primary}); }
          100% { transform: scale(1); filter: drop-shadow(0 0 0px ${primary}); }
        }
        .gradient-text {
          background: linear-gradient(90deg, ${gradientStart}, ${gradientEnd});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .btn-gradient {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .btn-gradient:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
      `}</style>
    </motion.div>
  );
};

export default Step6Success;