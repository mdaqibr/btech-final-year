import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const Step5Success = () => {
  return (
    <motion.div
      key="step5"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center"
    >
      <CheckCircle size={70} className="text-success mb-3" />
      <h3 className="fw-bold">You're all set!</h3>
      <p className="text-muted mt-2">
        Your employee profile has been created successfully.
      </p>

      <a href="/login" className="btn btn-primary mt-3 w-100">
        Go to Login →
      </a>
    </motion.div>
  );
};

export default Step5Success;