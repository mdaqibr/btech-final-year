import React from "react";
import Navbar from "../components/Navbar";

const links = [
  { path: "/vendor/dashboard", label: "Dashboard" },
  { path: "/vendor/orders", label: "Orders" },
  { path: "/vendor/feedback", label: "Feedback" }
];

const VendorLayout = ({ children }) => {
  return (
    <>
      <Navbar links={links} />
      <div className="container mt-4">{children}</div>
    </>
  );
};

export default VendorLayout;
