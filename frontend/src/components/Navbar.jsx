import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Coffee, User, LogOut, Menu } from "lucide-react";
import Notifications from "./Notifications";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Navbar = ({ links }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user-data") || "{}");

  const loginUrl = user?.user_type === "worker" ? "/worker-login" : "/login";

  const handleLogout = () => {
    localStorage.clear();
    navigate(loginUrl);
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light shadow-sm"
      style={{
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #eaeaea",
      }}
    >
      <div className="container">
        {/* LEFT: BRAND */}
        <span className="navbar-brand fw-bold text-primary d-flex align-items-center gap-2">
          <Coffee size={20} />
          Cafetero
        </span>

        {/* RIGHT: Notifications + Hamburger */}
        <div className="d-flex align-items-center ms-auto gap-2">
          {/* 🔔 Notifications — ALWAYS VISIBLE */}
          <Notifications />

          {/* ☰ Hamburger */}
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* COLLAPSIBLE CONTENT (USER + LINKS) */}
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarContent"
        >
          {/* 👤 User Dropdown */}
          <ul className="navbar-nav align-items-lg-center gap-lg-2 mt-3 mt-lg-0">
            {/* NAV LINKS */}
            {links.map((link) => (
              <li className="nav-item" key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `nav-link px-3 rounded ${
                      isActive ? "bg-primary text-white fw-semibold" : ""
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            <li className="nav-item dropdown">
              <button
                className="btn btn-outline-primary btn-sm dropdown-toggle d-flex align-items-center gap-1"
                data-bs-toggle="dropdown"
              >
                <User size={14} />
                <span>
                  {user.email?.split("@")[0] || user.name || "User"}
                </span>
              </button>

              <ul className="dropdown-menu dropdown-menu-end shadow">
                <li>
                  <button
                    className="dropdown-item text-danger d-flex align-items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
