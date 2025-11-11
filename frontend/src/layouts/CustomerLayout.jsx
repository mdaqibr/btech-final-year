import React from "react";
import Navbar from "../components/Navbar";

const links = [
  { path: "/customer/dashboard", label: "Dashboard" },
  { path: "/customer/orders", label: "My Orders" },
  { path: "/customer/feedback", label: "Feedback" }
];

const CustomerLayout = ({ children }) => {
  return (
    <>
      <Navbar links={links} />
      <div className="container mt-4">{children}</div>
    </>
  );
};

export default CustomerLayout;
