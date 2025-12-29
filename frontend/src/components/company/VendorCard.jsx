import React from "react";
import { useNavigate } from "react-router-dom";

const VendorCard = ({ vendor }) => {
  const navigate = useNavigate();

  return (
    <div
      className="card p-3 shadow-sm"
      style={{ cursor: "pointer", borderRadius: "12px" }}
      onClick={() => navigate(`/company/vendors/${vendor.id}`)}
    >
      <h5 className="fw-semibold">{vendor.name}</h5>
      <p className="text-muted small">{vendor.industry}</p>
      <p className="text-primary small">{vendor.status}</p>
    </div>
  );
};

export default VendorCard;
