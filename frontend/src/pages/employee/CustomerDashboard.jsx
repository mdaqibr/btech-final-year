import { useEffect, useState } from "react";
import { Building2, Layers, User2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getEmployeeDashboard } from "../../api/employee";

export default function CustomerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getEmployeeDashboard()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );

  return (
    <div className="container-fluid px-2 px-md-3">
      {/* HEADER */}
      <div className="mb-4">
        <h5 className="fw-bold d-flex align-items-center gap-2 mb-1">
          <Building2 size={22} className="text-primary" />
          {data?.branch_name || "My Workplace"}
        </h5>

        <p className="text-muted small d-flex align-items-center gap-1 mb-0">
          <User2 size={14} />
          Welcome {data?.full_name} ({data?.employee_code})
        </p>
      </div>

      {/* EMPTY STATE */}
      {(!data?.buildings || data.buildings.length === 0) && (
        <div className="card border-0 shadow-sm bg-info-subtle text-center p-4">
          <div className="d-flex justify-content-center mb-2">
            <div className="bg-white rounded-circle p-3 shadow-sm">
              <Building2 size={32} className="text-primary" />
            </div>
          </div>
          <h6 className="fw-semibold mb-1">No Buildings Assigned</h6>
          <p className="text-muted small mb-0">
            You are not assigned to any building yet. Please contact your admin.
          </p>
        </div>
      )}

      {/* BUILDINGS */}
      {data?.buildings?.length > 0 && (
        <div className="row g-3 g-lg-4">
          {data.buildings.map((b, index) => {
            const bgList = [
              "bg-primary-subtle",
              "bg-success-subtle",
              "bg-warning-subtle",
              "bg-info-subtle",
            ];

            return (
              <div key={b.id} className="col-12 col-sm-6 col-lg-4">
                <div
                  role="button"
                  onClick={() => navigate(`/employee/${b.id}/floors`)} // relative path
                  className={`card border-0 shadow-sm h-100 ${
                    bgList[index % 4]
                  }`}
                >
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-white rounded-3 p-2 shadow-sm d-flex align-items-center justify-content-center">
                        <Building2 size={20} className="text-primary" />
                      </div>

                      <div>
                        <h6 className="fw-semibold mb-0 text-truncate">
                          {b.name}
                        </h6>
                        <small className="text-muted d-flex align-items-center gap-1">
                          <Layers size={14} />
                          {b.floor_count || 0} Floors
                        </small>
                      </div>
                    </div>

                    <ChevronRight className="text-muted" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
