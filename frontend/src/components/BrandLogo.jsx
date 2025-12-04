import React from "react";
import { motion } from "framer-motion";
import { Coffee } from "lucide-react";

const BrandLogo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="d-flex align-items-center gap-2 text-white position-relative"
      style={{ userSelect: "none" }}
    >
      <motion.div
        initial={{ rotate: -20, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Coffee size={28} />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="fw-bold m-0"
        style={{ letterSpacing: "1px" }}
      >
        <span className="brand-text-glow">Cafetero</span>
      </motion.h3>

      <style>{`
        /* Always-shining premium text */
        .brand-text-glow {
          background: linear-gradient(
            90deg,
            #ffffff 0%,
            #ffe3a0 25%,
            #ffbe57 50%,
            #ffe3a0 75%,
            #ffffff 100%
          );
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          /* Subtle breathing glow */
          animation: glowPulse 4s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0% {
            text-shadow: 0 0 3px rgba(255,255,255,0.4),
                         0 0 6px rgba(255,200,120,0.3);
          }
          50% {
            text-shadow: 0 0 6px rgba(255,255,255,0.7),
                         0 0 14px rgba(255,200,120,0.5);
          }
          100% {
            text-shadow: 0 0 3px rgba(255,255,255,0.4),
                         0 0 6px rgba(255,200,120,0.3);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default BrandLogo;