// src/pages/vendor/sections/VendorStats.jsx
import { Store, Users, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { getVendorStats } from "../../../api/vendor";

export default function VendorStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVendorStats()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  const config = [
    { key: "branches", label: "Active Branches", icon: Store },
    { key: "workers", label: "Active Workers", icon: Users },
    { key: "orders", label: "Monthly Orders", icon: TrendingUp },
  ];

  return (
    <div className="row g-3 mb-4">
      {config.map((s, i) => (
        <div key={i} className="col-md-4">
          <div className="vendor-card card border-0 p-3">
            {loading ? (
              <div className="skeleton" style={{ height: 60 }} />
            ) : (
              <div className="d-flex gap-3 align-items-center">
                <s.icon size={28} className="text-primary" />
                <div>
                  <div className="fw-bold fs-5">{stats?.[s.key] ?? 0}</div>
                  <div className="text-muted small">{s.label}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
