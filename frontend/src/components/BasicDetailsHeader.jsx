import React from "react";
import { Sparkles, Mail } from "lucide-react";

const BasicDetailsHeader = ({ title, subtitle, email }) => {
  return (
    <div className="mb-4 text-center">

      {/* Title Row */}
      <div className="d-flex justify-content-center align-items-center gap-2 mb-1">
        <Sparkles size={22} style={{ color: "#f5c542" }} /> {/* black sparkle */}
        <h2
          style={{
            fontSize: "1.8rem",
            margin: 0,
            fontWeight: 700,
            color: "#000", // black for title
          }}
        >
          {title || "You’re almost done!"}
        </h2>
      </div>

      {/* Subtitle / Description */}
      {subtitle && (
        <p
          style={{
            color: "#555", // medium gray for subtitle
            marginBottom: "6px",
            fontSize: "1rem",
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Email Row */}
      {email && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-1">
          <Mail size={16} style={{ color: "#777" }} /> {/* lighter gray icon */}
          <p style={{ color: "#333", margin: 0, fontWeight: 500 }}> {/* dark gray text */}
            {email}
          </p>
        </div>
      )}
    </div>
  );
};

export default BasicDetailsHeader;