import React from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Store, Users, Wallet, UserPlus, Package } from "lucide-react";

const DashboardNew = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Vendors",
      desc: "Manage Onboarded Vendors, Requests, and Performance",
      icon: <Store size={32} />,
      path: "/company/vendors",
      bg: "linear-gradient(135deg, #e8f0ff, #d9e4ff)",
    },
    {
      title: "Employees",
      desc: "Add, Import & Manage Company Employees",
      icon: <Users size={32} />,
      path: "/company/employees/import",
      bg: "linear-gradient(135deg, #e9fff4, #d6ffe8)",
    },
    {
      title: "Wallet",
      desc: "Company to Vendor Payments & Employee Allowances",
      icon: <Wallet size={32} />,
      path: "/company/wallet",
      bg: "linear-gradient(135deg, #fff3e0, #ffe9cc)",
    },
    {
      title: "Guest Visit",
      desc: "Food Coupons & Billing for Visitors",
      icon: <UserPlus size={32} />,
      path: "/company/guests",
      bg: "linear-gradient(135deg, #f3f3ff, #e7e7ff)",
    },
    {
      title: "Inventory",
      desc: "Manage cafeteria inventory (future)",
      icon: <Package size={32} />,
      path: "/company/inventory",
      bg: "linear-gradient(135deg, #f9f9f9, #ececec)",
    },
  ];

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <Building2 size={30} /> Company Dashboard
      </h2>

      <div className="row">
        {cards.map((card, i) => (
          <div key={i} className="col-md-4 col-lg-3 mb-4">
            <div
              className="p-4 shadow-sm dashboard-card h-100"
              style={{
                background: card.bg,
                borderRadius: "14px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => navigate(card.path)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
            >
              <div className="mb-3">{card.icon}</div>
              <h5 className="fw-semibold">{card.title}</h5>
              <p className="text-muted small">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardNew;