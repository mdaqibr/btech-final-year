// src/pages/company/shared/FeatureDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Store, Users, Wallet, UserPlus, Package } from "lucide-react";

const FeatureDashboard = ({ basePath }) => {
  const navigate = useNavigate();

  const items = [
    { title: "Vendors", icon: <Store size={28} />, path: `${basePath}/vendors`, bg: "linear-gradient(135deg,#eef2ff,#e6f0ff)" },
    { title: "Employees", icon: <Users size={28} />, path: `${basePath}/employees`, bg: "linear-gradient(135deg,#ecfff7,#dfffee)" },
    { title: "Wallet", icon: <Wallet size={28} />, path: `${basePath}/wallet`, bg: "linear-gradient(135deg,#fff7ec,#fff1db)" },
    { title: "Guests", icon: <UserPlus size={28} />, path: `${basePath}/guests`, bg: "linear-gradient(135deg,#f6f4ff,#efeaff)" },
    { title: "Inventory", icon: <Package size={28} />, path: `${basePath}/inventory`, bg: "linear-gradient(135deg,#fbfcfd,#f3f6f8)" },
  ];

  return (
    <div className="container py-4">
      <div className="row g-3">
        {items.map((it, i) => (
          <div key={i} className="col-12 col-sm-6 col-lg-4">
            <div
              className="p-4 rounded shadow-sm d-flex gap-3 align-items-start"
              style={{ background: it.bg, cursor: "pointer", transition: "transform .18s ease" }}
              onClick={() => navigate(it.path)}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-6px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div className="d-flex align-items-center justify-content-center" style={{ width: 52, height: 52, borderRadius: 10, background: "rgba(255,255,255,0.6)" }}>
                {it.icon}
              </div>
              <div>
                <h5 className="mb-1 fw-semibold" style={{ fontSize: 16 }}>{it.title}</h5>
                <p className="mb-0 text-muted small">Manage {it.title.toLowerCase()} for this scope</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureDashboard;