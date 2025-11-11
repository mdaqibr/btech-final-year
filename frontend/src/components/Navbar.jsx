import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Navbar = ({ links }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user-data") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
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
      <div className="container-fluid">
        {/* Brand */}
        <span className="navbar-brand fw-bold text-primary">
          ☕ Cafetero
        </span>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Links */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {links.map((link) => (
              <li className="nav-item" key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `nav-link px-3 rounded ${isActive ? "bg-primary text-white fw-semibold" : ""}`
                  }
                  style={{ marginRight: "6px" }}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* User Section */}
          <div className="dropdown">
            <button
              className="btn btn-outline-primary dropdown-toggle rounded-pill"
              data-bs-toggle="dropdown"
            >
              👤 {user.email?.split("@")[0] || "User"}
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow">
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
