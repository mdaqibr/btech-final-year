import React, { useState } from "react";
import { loginAPI } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("admin@cafetero.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginAPI(email, password);

      // Save tokens
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("user-data", JSON.stringify(data.user));
      
      console.log("✅ LOGIN SUCCESS:", data);
      console.log("👤 User Type:", data.user.user_type);
      await new Promise(r => setTimeout(r, 200)); // allow logs

      // Redirect based on user_type
      const userType = data.user.user_type;

      // admin@cafetero.com
      switch (userType) {
        case "Admin":
          navigate("/admin");
          break;
        case "Company":
          navigate("/company");
          break;
        case "Vendor":
          navigate("/vendor");
          break;
        case "Customer":
          navigate("/customer");
          break;
        case "Worker":
          navigate("/worker");
          break;
        default:
          navigate("/");
      }
      
    } catch (err) {
      console.log("ERROR:", err)
      setError("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="card shadow-lg p-4 bg-light" style={{ borderRadius: "16px" }}>
      <h3 className="text-center mb-4 text-primary fw-bold">Cafetero Login</h3>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label fw-semibold d-flex">Email</label>
          <input
            type="email"
            className="form-control rounded-pill"
            placeholder="yourname@company.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label className="form-label fw-semibold d-flex">Password</label>
          <input
            type="password"
            className="form-control rounded-pill"
            placeholder="********"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 rounded-pill mt-3"
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <p className="text-center mt-3 text-muted" style={{ fontSize: "14px" }}>
        Powered by <b>Cafetero</b>
      </p>
    </div>
  );
};

export default Login;
