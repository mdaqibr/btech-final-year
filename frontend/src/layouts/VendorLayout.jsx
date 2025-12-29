import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const links = [
  { path: "/vendor/dashboard", label: "Dashboard" },
  { path: "/vendor/orders", label: "Orders" },
  { path: "/vendor/requests", label: "Requests" },
  { path: "/vendor/branches", label: "Branches" },
  { path: "/vendor/workers", label: "Workers" },
  { path: "/vendor/foods", label: "Manage Foods" },
];

const VendorLayout = () => {
  return (
    <div style={{ backgroundColor: "#f6f8fc", minHeight: "100vh" }}>
      <Navbar links={links} />
      <div className="container mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default VendorLayout;
