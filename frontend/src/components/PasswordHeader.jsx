// components/GreetingTitle.jsx
import React from "react";
import { motion } from "framer-motion";
import { Coffee } from "lucide-react";

const PasswordHeader = ({ userType, purpose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-4"
    >
      {/* Cafetero Brand */}
      <div className="d-flex align-items-center gap-2">
        <Coffee size={20} className="text-warning" />
        <h5 className="fw-bold m-0 brand-text-glow">Cafetero</h5>
      </div>

      {/* Secondary title */}
      <h4 className="fw-semibold mt-2">
        Set your password as a <span className="text-primary">{userType}</span>
      </h4>

      {/* Purpose text */}
      <p className="text-muted small">{purpose}</p>

      <style>{`
        .brand-text-glow {
          background: linear-gradient(
            90deg,
            #ffffff 0%,
            #ffe3a0 25%,
            #ffc25a 50%,
            #ffe3a0 75%,
            #ffffff 100%
          );
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: glowPulse 4s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0% { text-shadow: 0 0 4px rgba(255,240,180,.3); }
          50% { text-shadow: 0 0 10px rgba(255,200,120,.6); }
          100% { text-shadow: 0 0 4px rgba(255,240,180,.3); }
        }
      `}</style>
    </motion.div>
  );
};

export default PasswordHeader;