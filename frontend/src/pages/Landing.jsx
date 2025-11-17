import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
        <div className="container">
          <h3 className="fw-bold text-primary m-0">Cafetero</h3>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item px-2"><a className="nav-link" href="#features">Features</a></li>
              <li className="nav-item px-2"><a className="nav-link" href="#pricing">Pricing</a></li>
              <li className="nav-item px-2"><a className="nav-link" href="#contact">Contact</a></li>
            </ul>
            <button className="btn btn-outline-primary ms-3 rounded-pill" onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="bg-light py-5">
        <div className="container text-center">
          <h1 className="fw-bold display-5 text-dark">
            Smart Cafeteria & Vendor Management Platform
          </h1>
          <p className="lead text-muted mt-3 mb-4">
            Manage vendors, employees, orders & payments — all in one place.
          </p>

          <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
            <button className="btn btn-primary btn-lg rounded-pill px-4"
              onClick={() => navigate("/companies/new")}
            >
              Register as Company
            </button>
            <button className="btn btn-outline-primary btn-lg rounded-pill px-4"
              onClick={() => navigate("/register/vendor")}
            >
              Register as Vendor
            </button>
            <button className="btn btn-outline-secondary btn-lg rounded-pill px-4"
              onClick={() => navigate("/register/employee")}
            >
              Register as Employee
            </button>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section id="features" className="py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Why Cafetero?</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="p-4 shadow-sm rounded bg-white">
                <h4>Vendor Management</h4>
                <p className="text-muted">Manage multiple vendors easily with reports & analytics.</p>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="p-4 shadow-sm rounded bg-white">
                <h4>Employee Menu System</h4>
                <p className="text-muted">Smart ordering with employee access & tracking.</p>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="p-4 shadow-sm rounded bg-white">
                <h4>Payments & Wallet</h4>
                <p className="text-muted">Integrated billing & wallet management like canteen cards.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="bg-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Simple Pricing</h2>
          <p className="lead mb-2">Start free, upgrade as you grow.</p>

          <div className="card shadow border-0 p-4 mx-auto" style={{ maxWidth: "400px" }}>
            <h3>Free</h3>
            <p className="text-muted">For startups & small teams</p>
            <button className="btn btn-primary rounded-pill px-4 mt-2">Get Started</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-white text-center py-3" id="contact">
        <p className="m-0">© {new Date().getFullYear()} Cafetero. All Rights Reserved.</p>
      </footer>
    </>
  );
};

export default Landing;
