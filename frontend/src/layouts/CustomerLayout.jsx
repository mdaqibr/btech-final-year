import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const links = [
  { path: "/employee/dashboard", label: "Dashboard" },
  { path: "/employee/your-orders", label: "My Orders" },
  // { path: "/customer/feedback", label: "Feedback" },
];

export default function CustomerLayout() {
  return (
    <>
      <Navbar links={links} />

      <div className="bg-body-secondary min-vh-100">
        <div className="container py-4">
          <div className="bg-white bg-opacity-75 rounded-4 shadow-sm p-3 p-md-4">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
