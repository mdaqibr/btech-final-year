import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const AuthHeader = ({ variant = "company", userType, purpose }) => {
  const styles = {
    company: {
      titleColor: "#0d6efd",
      highlightBg: "rgba(13,110,253,0.1)",
      textColor: "#333",
      subtitleColor: "#555",
    },
    employee: {
      titleColor: "#28a745",
      highlightBg: "rgba(40,167,69,0.1)",
      textColor: "#2d2d2d",
      subtitleColor: "#666",
    },
    vendor: {
      titleColor: "#6f42c1",
      highlightBg: "rgba(111,66,193,0.12)",
      textColor: "#3a3a3a",
      subtitleColor: "#6b6b6b",
    },
  };

  const theme = styles[variant];

  return (
    <div className="mb-4">
      {/* Welcome Line */}
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="fw-bold d-flex align-items-center gap-2"
        style={{ color: theme.titleColor }}
      >
        Welcome to{" "}
        <span
          className="px-2 py-1 rounded"
          style={{
            background: theme.highlightBg,
            fontWeight: "bold",
            color: theme.titleColor,
          }}
        >
          Cafetero
        </span>
        <Sparkles size={20} />
      </motion.h3>

      {/* Sign Up Sentence */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="fw-semibold"
        style={{ color: theme.textColor }}
      >
        Sign up as a <span className="text-capitalize">{userType}</span> to{" "}
        <span className="text-capitalize">{purpose}</span>.
      </motion.p>

      {/* Instruction */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="small"
        style={{ color: theme.subtitleColor }}
      >
        Kindly enter your email to continue.
      </motion.p>
    </div>
  );
};

export default AuthHeader;