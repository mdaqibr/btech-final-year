import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import CompanyLayout from "./layouts/CompanyLayout";
import VendorLayout from "./layouts/VendorLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import WorkerLayout from "./layouts/WorkerLayout";
import LoginLayout from "./layouts/LoginLayout";

// Pages
import Login from "./pages/Login";
import CompanyDashboard from "./pages/company/Dashboard";
import VendorDashboard from "./pages/vendor/Dashboard";
import CustomerDashboard from "./pages/customer/Dashboard";
import WorkerDashboard from "./pages/worker/Dashboard";
import Landing from "./pages/Landing";

// Registratin pages
import CompanyRegister from "./pages/company/CompanyRegister";
import VendorRegister from "./pages/vendor/VendorRegister";
import EmployeeRegister from "./pages/employee/EmployeeRegister";

// Auth Utility
const isAuthenticated = () => {
  const access = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user-data") || "{}");
  return access && user?.user_type;
};

const ProtectedRoute = ({ allowedRoles, children }) => {
  const access = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user-data") || "{}");

  if (!access) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.user_type)) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public */}
      {/* TODO: if logged in then do not show login button. */}
      
      <Route path="/" element={<Landing />} />

      <Route path="/companies/new" element={<CompanyRegister />} />
      <Route path="/vendors/new" element={<VendorRegister />} />
      <Route path="/employees/new" element={<EmployeeRegister />} />

      <Route element={<LoginLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Company */}
      <Route
        path="/company"
        element={
          <ProtectedRoute allowedRoles={["Company"]}>
            <CompanyLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<CompanyDashboard />} />
      </Route>

      {/* Vendor */}
      <Route
        path="/vendor"
        element={
          <ProtectedRoute allowedRoles={["Vendor"]}>
            <VendorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<VendorDashboard />} />
      </Route>

      {/* Customer */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<CustomerDashboard />} />
      </Route>

      {/* Worker */}
      <Route
        path="/worker"
        element={
          <ProtectedRoute allowedRoles={["Worker"]}>
            <WorkerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<WorkerDashboard />} />
      </Route>

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;