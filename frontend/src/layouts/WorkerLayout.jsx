// src / layouts / WorkerLayout.jsx;
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const links = [
  { path: "/worker/dashboard", label: "Dashboard" },
  { path: "/worker/today-orders", label: "Today's Orders" },
  { path: "/worker/tasks", label: "Tasks" },
  { path: "/worker/feedback", label: "Feedback" },
];

const WorkerLayout = ({ children }) => {
  return (
    <>
      <div style={{ backgroundColor: "#f6f8fc", minHeight: "100vh" }}>
        <Navbar links={links} />
        <div className="container mt-4">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default WorkerLayout;
