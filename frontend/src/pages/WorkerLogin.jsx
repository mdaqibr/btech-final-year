import React, { useState } from "react";
import { workerLoginAPI } from "../api/workerAuth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function WorkerLogin() {
  const [loginId, setLoginId] = useState("CI0001");
  const [pin, setPin] = useState("1190");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await workerLoginAPI(loginId, pin);

      console.log("HI this is aqib.");

      navigate("/worker/today-orders");
    } catch (err) {
      setError("Invalid Login ID or PIN");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "420px" }}>
      <div className="card p-4 shadow-lg">
        <h4 className="text-center text-primary fw-bold mb-3">Worker Login</h4>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Login ID</label>
            <input
              type="text"
              className="form-control"
              required
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">PIN Code</label>
            <input
              type="password"
              className="form-control"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
