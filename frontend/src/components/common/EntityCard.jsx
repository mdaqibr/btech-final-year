// src/components/common/EntityCard.jsx
import React from "react";

const EntityCard = ({ title, subtitle, badge, onClick, accent }) => {
  return (
    <div
      className="card h-100 shadow-sm p-3"
      style={{
        borderRadius: 12,
        cursor: onClick ? "pointer" : "default",
        background: accent || "linear-gradient(135deg,#ffffff,#f7fbff)",
        transition: "transform .18s ease, box-shadow .18s ease",
      }}
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div className="d-flex align-items-start justify-content-between">
        <div>
          <h5 className="mb-1" style={{ fontSize: 18 }}>{title}</h5>
          {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
        </div>
        {badge && (
          <div className="badge bg-light text-dark" style={{ height: 34, alignSelf: "center" }}>
            {badge}
          </div>
        )}
      </div>
    </div>
  );
};

export default EntityCard;
