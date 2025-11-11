import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const links = [
  { path: "/company/dashboard", label: "Dashboard" },
  { path: "/company/vendors", label: "Vendors" },
  { path: "/company/customers", label: "Customers" },
  { path: "/company/reports", label: "Reports" }
];

const CompanyLayout = () => {
  return (
    <>
      <Navbar links={links} />
      <div className="container mt-4">
        <Outlet />   {/* <-- This is where child routes render */}
      </div>
    </>
  );
};

export default CompanyLayout;
