import React from "react";
import { Sparkles, Mail } from "lucide-react";

const GreetingBlock = ({ email, onBack }) => {
  return (
    <div
      className="text-center mx-auto"
      style={{
        color: "#333", // dark text
        padding: "2rem 1rem",
        maxWidth: "500px", // prevents content stretching on large screens
        width: "90%", // responsive width
      }}
    >
      {/* Title */}
      <div
        className="d-flex justify-content-center align-items-center gap-2 flex-wrap mb-3"
      >
        <Sparkles size={28} style={{ color: "#f5c542" }} />
        <h2
          style={{
            fontSize: "1.6rem",
            margin: 0,
            fontWeight: 700,
            color: "#333",
          }}
        >
          You’re almost there!
        </h2>
      </div>

      {/* Subtitle with email */}
      <div
        className="d-flex justify-content-center align-items-center gap-2 flex-wrap mb-2"
      >
        <Mail size={20} style={{ color: "#777" }} />
        <p
          style={{
            color: "#555",
            margin: 0,
            fontSize: "1rem",
            textAlign: "center",
          }}
        >
          Enter the 6-digit code we sent to{" "}
          <b style={{ color: "#333" }}>{email}</b>{" "}
          <span
            onClick={onBack}
            style={{
              color: "#f5c542",
              textDecoration: "underline",
              cursor: "pointer",
              marginLeft: "4px",
              fontWeight: 600,
            }}
          >
            Change
          </span>
        </p>
      </div>

      {/* Subtitle */}
      <p
        style={{
          color: "#555",
          marginTop: "1rem",
          fontSize: "0.95rem",
          lineHeight: 1.4,
        }}
      >
        Just verify your email to unlock the next step
      </p>
    </div>
  );
};

export default GreetingBlock;