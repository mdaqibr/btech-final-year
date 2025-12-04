import React from "react";
import { ArrowRight } from "lucide-react";

const AlreadyHaveAccount = ({ onLogin }) => {
  return (
    <div
      className="text-center mt-4 p-3"
      style={{
        borderRadius: "12px",
        maxWidth: "480px",
        margin: "1.5rem auto 0",
      }}
    >
      <p style={{ color: "#555", marginBottom: "0.75rem", fontSize: "0.95rem" }}>
        Already have an account? You can quickly login and continue.
      </p>

      <button
        onClick={onLogin}
        className="btn btn-outline-primary round-shape d-flex justify-content-center align-items-center gap-2"
        style={{ width: "fit-content", margin: "0 auto" }}
      >
        Login <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default AlreadyHaveAccount;