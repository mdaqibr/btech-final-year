import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* Layouts */
import CompanyLayout from "./layouts/CompanyLayout";
import VendorLayout from "./layouts/VendorLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import WorkerLayout from "./layouts/WorkerLayout";
import LoginLayout from "./layouts/LoginLayout";

// Register
import CompanyRegister from "./pages/company/CompanyRegister";
import VendorRegister from "./pages/vendor/VendorRegister";

// Employee
import EmployeeRegister from "./pages/employee/EmployeeRegister";
import EmpBuildingFloors from "./pages/employee/BuildingFloors";
import EmpFloorVendors from "./pages/employee/FloorVendors";
import VendorMenu from "./pages/employee/VendorMenu";
import TodayMenuItems from "./pages/employee/TodayMenuItems";
import YourCart from "./pages/employee/YourCart";
import YourOrders from "./pages/employee/YourOrders";

/* Public pages */
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import WorkerLogin from "./pages/WorkerLogin";

/* Dashboards */
import VendorDashboard from "./pages/vendor/Dashboard";
import CustomerDashboard from "./pages/employee/CustomerDashboard";
import WorkerDashboard from "./pages/worker/Dashboard";

/* Company pages */
import BranchesList from "./pages/company/branches/BranchesList";
import BuildingsList from "./pages/company/buildings/BuildingsList";
import BuildingDashboard from "./pages/company/buildings/BuildingDashboard";
import BuildingFeatureDashboard from "./pages/company/buildings/BuildingFeatureDashboard";
import FloorsList from "./pages/company/floors/FloorsList";
import FloorDashboard from "./pages/company/floors/FloorDashboard";
import FloorVendors from "./pages/company/floors/FloorVendors";
import CompanyVendors from "./pages/company/vendors/CompanyVendors";
import VendorDetail from "./pages/company/vendors/VendorDetail";
import VendorPerformance from "./pages/company/floors/VendorPerformance";

/* Route Guards */
import { ProtectedRoute } from "./auth/routeGuards";
import { getAuthUser } from "./auth/auth";

// VENDOR
import VendorRequests from "./pages/vendor/sections/VendorRequests";
import WorkersPage from "./pages/vendor/Workers";
import BranchesPage from "./pages/vendor/BranchesPage";
import VendorFoods from "./pages/vendor/foods/VendorFoods";
import FloorFoodSetup from "./pages/vendor/FloorFoodSetup";
import VendorBranchDetails from "./pages/vendor/branches/VendorBranchDetails";

// WORKER
import TodayOrders from "./pages/worker/TodayOrders";

function App() {
  const { isAuthenticated, user } = getAuthUser();

  return (
    <Routes>
      {/* ---------- PUBLIC ---------- */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate
              to={`/${user.user_type.toLowerCase()}/dashboard`}
              replace
            />
          ) : (
            <Landing />
          )
        }
      />

      <Route path="/companies/new" element={<CompanyRegister />} />
      <Route path="/vendors/new" element={<VendorRegister />} />
      <Route path="/employees/new" element={<EmployeeRegister />} />

      <Route element={<LoginLayout />}>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate
                to={`/${user.user_type.toLowerCase()}/dashboard`}
                replace
              />
            ) : (
              <Login />
            )
          }
        />
      </Route>
      <Route path="/worker-login" element={<WorkerLogin />} />

      {/* ---------- COMPANY ROUTES (GROUPED) ---------- */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["Company"]}>
            <CompanyLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/company/dashboard" element={<BranchesList />} />

        {/* Buildings */}
        <Route
          path="/company/branches/:branchId/buildings"
          element={<BuildingsList />}
        />

        {/* Building */}
        <Route
          path="/company/branches/:branchId/buildings/:buildingId/dashboard"
          element={<BuildingDashboard />}
        />
        <Route
          path="/company/branches/:branchId/buildings/:buildingId"
          element={<BuildingFeatureDashboard />}
        />

        {/* Floors */}
        <Route
          path="/company/branches/:branchId/buildings/:buildingId/floors"
          element={<FloorsList />}
        />
        <Route
          path="/company/branches/:branchId/buildings/:buildingId/floors/add"
          element={<FloorsList />}
        />
        <Route
          path="/company/branches/:branchId/buildings/:buildingId/floors/:floorId/dashboard"
          element={<FloorDashboard />}
        />

        <Route
          path="/company/branches/:branchId/buildings/:buildingId/floors/:floorId/vendors"
          element={<FloorVendors />}
        />

        <Route
          path="/company/branches/:branchId/buildings/:buildingId/floors/:floorId/vendors/:companyVendorId/performance"
          element={<VendorPerformance />}
        />

        <Route path="/company/vendors" element={<CompanyVendors />} />

        <Route path="/company/vendors/:vendorId" element={<VendorDetail />} />
      </Route>

      {/* ---------- VENDOR ---------- */}
      <Route
        path="/vendor"
        element={
          <ProtectedRoute allowedRoles={["Vendor"]}>
            <VendorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="branches" element={<BranchesPage />} />
        <Route path="requests" element={<VendorRequests />} />
        <Route path="workers" element={<WorkersPage />} />
        <Route path="foods" element={<VendorFoods />} />
        <Route path="branches/:branchId" element={<VendorBranchDetails />} />
        <Route path="floor/:id/set-up" element={<FloorFoodSetup />} />
      </Route>

      {/* ---------- CUSTOMER ---------- */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={["Employee"]}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path=":buildingId/floors" element={<EmpBuildingFloors />} />
        <Route path="floors/:floorId/vendors" element={<EmpFloorVendors />} />
        <Route
          path="floors/:floorId/vendors/:vendorBranchId/menu"
          element={<VendorMenu />}
        />
        <Route
          path="floors/:floorId/vendors/:vendorBranchId/today-menu/:foodType"
          element={<TodayMenuItems />}
        />
        <Route path="your-cart" element={<YourCart />} />
        <Route path="your-orders" element={<YourOrders />} />
      </Route>

      {/* ---------- WORKER ---------- */}
      <Route
        path="/worker"
        element={
          <ProtectedRoute allowedRoles={["Worker"]}>
            <WorkerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<WorkerDashboard />} />
        <Route path="today-orders" element={<TodayOrders />} />;
      </Route>

      {/* ---------- FALLBACK ---------- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
