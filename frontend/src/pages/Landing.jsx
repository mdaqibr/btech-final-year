import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Store,
  BadgeCheck,
  Users,
  CreditCard,
  TrendingUp,
} from "lucide-react";

import "bootstrap/dist/css/bootstrap.min.css";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Landing = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3"
      >
        <div className="container">
          <h3 className="fw-bold text-primary m-0 d-flex align-items-center gap-1">
            <Store size={28} /> Cafetero
          </h3>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item px-2">
                <a className="nav-link" href="#features">
                  Features
                </a>
              </li>
              <li className="nav-item px-2">
                <a className="nav-link" href="#pricing">
                  Pricing
                </a>
              </li>
              <li className="nav-item px-2">
                <a className="nav-link" href="#contact">
                  Contact
                </a>
              </li>
            </ul>

            <button
              className="btn btn-outline-primary ms-3"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <header
        className="py-5"
        style={{
          background:
            "linear-gradient(135deg, #f7faff 0%, #eef3ff 40%, #e9f0ff 100%)",
        }}
      >
        <motion.div
          className="container text-center"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          <motion.h1
            className="fw-bold display-5 text-dark"
            variants={fadeUp}
          >
            Smart Cafeteria & Vendor Management Platform
          </motion.h1>

          <motion.p
            className="lead text-muted mt-3 mb-4"
            variants={fadeUp}
          >
            Manage vendors, employees, orders & payments — all in one place.
          </motion.p>

          <motion.div
            className="d-flex justify-content-center gap-3 mt-4 flex-wrap"
            variants={fadeUp}
          >
            <button
              className="btn btn-primary btn-lg px-4 d-flex align-items-center gap-2"
              onClick={() => navigate("/companies/new")}
            >
              <Building2 size={20} /> Register as Company
            </button>

            <button
              className="btn btn-outline-primary btn-lg px-4 d-flex align-items-center gap-2"
              onClick={() => navigate("/register/vendor")}
            >
              <Store size={20} /> Register as Vendor
            </button>

            <button
              className="btn btn-outline-secondary btn-lg px-4 d-flex align-items-center gap-2"
              onClick={() => navigate("/register/employee")}
            >
              <Users size={20} /> Register as Employee
            </button>
          </motion.div>
        </motion.div>
      </header>

      {/* FEATURES */}
      <section
        id="features"
        className="py-5"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #f7faff 40%, #eef3ff 100%)",
        }}
      >
        <div className="container text-center">
          <motion.h2
            className="fw-bold mb-4"
            initial={fadeUp.hidden}
            whileInView={fadeUp.visible}
            viewport={{ once: true }}
          >
            Why Cafetero?
          </motion.h2>

          <div className="row">
            {[
              {
                icon: TrendingUp,
                title: "Vendor Management",
                iconColor: "#3b82f6",
                desc: "Manage multiple vendors easily with reports & analytics.",
                bg: "linear-gradient(135deg, #f0f7ff 0%, #e4efff 100%)",
                hover: "linear-gradient(135deg, #e8f0ff 0%, #dce8ff 100%)",
              },
              {
                icon: BadgeCheck,
                title: "Employee Menu System",
                iconColor: "#22c55e",
                desc: "Smart ordering with employee access & tracking.",
                bg: "linear-gradient(135deg, #f3fff7 0%, #e6ffef 100%)",
                hover: "linear-gradient(135deg, #ebffee 0%, #d9ffe6 100%)",
              },
              {
                icon: CreditCard,
                title: "Payments & Wallet",
                iconColor: "#a855f7",
                desc: "Integrated billing & wallet management like canteen cards.",
                bg: "linear-gradient(135deg, #faf3ff 0%, #f3e6ff 100%)",
                hover: "linear-gradient(135deg, #f5e9ff 0%, #ebdbff 100%)",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="col-md-4 mb-4"
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <div
                  className="p-4 shadow-sm h-100"
                  style={{
                    background: item.bg,
                    borderRadius: "14px",
                    transition: "0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = item.hover;
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0, 0, 0, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = item.bg;
                    e.currentTarget.style.transform = "translateY(0px)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 10px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <div className={`feature-icon mb-2`}>
                    <item.icon size={32} color={item.iconColor} />
                  </div>
                  <h4 className="fw-semibold">{item.title}</h4>
                  <p className="text-muted">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section
        id="pricing"
        className="py-5"
        style={{
          background:
            "linear-gradient(135deg, #f9fbff 0%, #f1f4ff 50%, #ecf1ff 100%)",
        }}
      >
        <div className="container text-center">
          <motion.h2
            className="fw-bold mb-4"
            initial={fadeUp.hidden}
            whileInView={fadeUp.visible}
            viewport={{ once: true }}
          >
            Simple Pricing
          </motion.h2>

          <motion.p
            className="lead mb-2"
            initial={fadeUp.hidden}
            whileInView={fadeUp.visible}
            viewport={{ once: true }}
          >
            Start free, upgrade as you grow.
          </motion.p>

          <motion.div
            className="p-4 mx-auto price-card"
            style={{ maxWidth: "420px" }}
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="fw-bold mb-2">Free</h3>
            <p className="text-muted">Perfect for startups & small teams</p>
            <button className="btn btn-primary px-4 mt-2">
              Get Started
            </button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-white text-center py-3" id="contact">
        <p className="m-0">
          © {new Date().getFullYear()} Cafetero. All Rights Reserved.
        </p>
      </footer>
    </>
  );
};

export default Landing;
