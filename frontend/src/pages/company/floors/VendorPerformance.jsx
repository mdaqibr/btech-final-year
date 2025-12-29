import React from "react";
import { useParams } from "react-router-dom";
import {
  Store,
  TrendingUp,
  Clock,
  Users,
  Calendar,
  Activity,
} from "lucide-react";

const VendorPerformance = () => {
  const { companyVendorId } = useParams();

  return (
    <div className="container py-4">
      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <h3 className="fw-bold d-flex align-items-center gap-2">
          <Store size={22} className="text-primary" />
          Vendor Performance
        </h3>
        <p className="text-muted mb-0">
          Insights & activity for vendor ID #{companyVendorId}
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="row g-3 mb-4">
        <StatCard
          title="Total Orders"
          value="1,248"
          icon={<TrendingUp />}
          bg="bg-primary-subtle"
          color="text-primary"
        />
        <StatCard
          title="Active Days"
          value="27"
          icon={<Calendar />}
          bg="bg-success-subtle"
          color="text-success"
        />
        <StatCard
          title="Avg Daily Users"
          value="156"
          icon={<Users />}
          bg="bg-warning-subtle"
          color="text-warning"
        />
        <StatCard
          title="Uptime"
          value="98.6%"
          icon={<Activity />}
          bg="bg-info-subtle"
          color="text-info"
        />
      </div>

      {/* ================= DETAILS ================= */}
      <div className="row g-4">
        {/* Service Timings */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-semibold d-flex align-items-center gap-2 mb-3">
                <Clock size={18} className="text-secondary" />
                Service Timings
              </h6>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Opening Time</span>
                <span className="fw-semibold">09:00 AM</span>
              </div>

              <div className="d-flex justify-content-between">
                <span className="text-muted">Closing Time</span>
                <span className="fw-semibold">06:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Placeholder */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-semibold d-flex align-items-center gap-2 mb-3">
                <Activity size={18} className="text-secondary" />
                Recent Activity
              </h6>

              <div className="text-muted small">
                <p>• Orders processed today: 42</p>
                <p>• Peak hour: 1:00 PM – 2:00 PM</p>
                <p>• Average preparation time: 6 mins</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= STYLES ================= */}
      <style>
        {`
          .stat-card {
            transition: transform .18s ease, box-shadow .18s ease;
          }
          .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0,0,0,.08);
          }
        `}
      </style>
    </div>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({ title, value, icon, bg, color }) => (
  <div className="col-12 col-sm-6 col-lg-3">
    <div className={`card border-0 shadow-sm stat-card ${bg}`}>
      <div className="card-body d-flex align-items-center gap-3">
        <div className={`icon-box ${color}`}>{icon}</div>
        <div>
          <div className="text-muted small">{title}</div>
          <div className="fw-bold fs-5">{value}</div>
        </div>
      </div>
    </div>
  </div>
);

export default VendorPerformance;
