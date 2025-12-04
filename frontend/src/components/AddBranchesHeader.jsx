import React from "react";
import { Sparkles, Mail } from "lucide-react";

const GreetingBlock = ({ email, onBackText, onBack, theme }) => {
  const primaryColor = theme?.primary || "#1E90FF"; // fallback to company blue
  const secondaryColor = theme?.secondary || "#6B7280";
  const textColor = theme?.text?.title || "#111827";
  const bodyColor = theme?.text?.body || "#374151";

  return (
    <div
      className="text-center mx-auto mb-4"
      style={{
        color: bodyColor,
        padding: "1.5rem 1rem",
        maxWidth: "500px",
        width: "90%",
        backgroundColor: theme?.background || "#f8f9fa",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap mb-2">
        <Sparkles size={28} style={{ color: primaryColor }} />
        <h2
          style={{
            fontSize: "1.5rem",
            margin: 0,
            fontWeight: 700,
            color: textColor,
          }}
        >
          You’re almost there!
        </h2>
      </div>

      {email && (
        <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap mb-2">
          <Mail size={20} style={{ color: secondaryColor }} />
          <p
            style={{
              color: bodyColor,
              margin: 0,
              fontSize: "1rem",
              textAlign: "center",
            }}
          >
            Verification email sent to <b>{email}</b>{" "}
            {onBack && (
              <span
                onClick={onBack}
                style={{
                  color: primaryColor,
                  textDecoration: "underline",
                  cursor: "pointer",
                  marginLeft: "4px",
                  fontWeight: 600,
                }}
              >
                {onBackText || "Change"}
              </span>
            )}
          </p>
        </div>
      )}

      <p
        style={{
          color: bodyColor,
          fontSize: "0.95rem",
          marginTop: "0.5rem",
          lineHeight: 1.4,
        }}
      >
        Please fill in your branch and building details below to continue.
      </p>
    </div>
  );
};

export default GreetingBlock;