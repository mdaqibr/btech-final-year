import React from "react";
import Navbar from "../components/Navbar";

const links = [
  { path: "/worker/dashboard", label: "Dashboard" },
  { path: "/worker/tasks", label: "Tasks" },
  { path: "/worker/feedback", label: "Feedback" }
];

const WorkerLayout = ({ children }) => {
  return (
    <>
      <Navbar links={links} />
      <div className="container mt-4">{children}</div>
    </>
  );
};

export default WorkerLayout;
