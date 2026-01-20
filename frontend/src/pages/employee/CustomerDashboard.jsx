import { useEffect, useState } from "react";
import {
  Building2,
  Layers,
  User2,
  ChevronRight,
  AlertCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getEmployeeDashboard } from "../../api/employee";
import EmployeeRegister from "../employee/EmployeeRegister";

export default function CustomerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getEmployeeDashboard()
      .then((res) => {
        setData(res.data);

        // Auto open profile modal if not completed
        if (res.data?.profile_completed === false) {
          setShowCompleteProfile(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  const needsProfileCompletion =
    !data || data?.profile_completed === false;

  return (
    <>
      <div className="container-fluid px-2 px-md-4 py-3">

        {/* ===== COMPLETE PROFILE BANNER ===== */}
        {needsProfileCompletion && (
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-warning-subtle">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-warning text-white rounded-circle p-2 d-flex align-items-center justify-content-center">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Complete Your Profile</h6>
                  <p className="text-muted small mb-0">
                    Finish setting up your employee details to unlock full access.
                  </p>
                </div>
              </div>

              <button
                className="btn btn-warning fw-semibold d-flex align-items-center gap-2"
                onClick={() => setShowCompleteProfile(true)}
              >
                Complete Now <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ===== HEADER ===== */}
        {data && (
          <div className="mb-4">
            <h4 className="fw-bold d-flex align-items-center gap-2 mb-1">
              <Building2 size={24} className="text-primary" />
              {data.branch_name || "My Workplace"}
            </h4>
            <p className="text-muted small d-flex align-items-center gap-1 mb-0">
              <User2 size={14} />
              Welcome <strong>{data.full_name}</strong> ({data.employee_code})
            </p>
          </div>
        )}

        {/* ===== EMPTY STATE ===== */}
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

        {/* ===== BUILDINGS ===== */}
        {data?.profile_completed && data?.buildings?.length > 0 && (
          <div className="row g-3 g-lg-4">
            {data.buildings.map((b, index) => {
              const accentList = [
                "border-primary",
                "border-success",
                "border-warning",
                "border-info",
              ];

              return (
                <div key={b.id} className="col-12 col-sm-6 col-lg-4">
                  <div
                    role="button"
                    onClick={() => navigate(`/employee/${b.id}/floors`)}
                    className={`card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative building-card`}
                  >
                    {/* Accent Strip */}
                    <div
                      className={`position-absolute top-0 start-0 w-100 border-top border-4 ${
                        accentList[index % 4]
                      }`}
                    />

                    <div className="card-body d-flex align-items-center justify-content-between p-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-white rounded-3 p-3 shadow-sm d-flex align-items-center justify-content-center">
                          <Building2 size={22} className="text-primary" />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1 text-truncate">{b.name}</h6>
                          <small className="text-muted d-flex align-items-center gap-1">
                            <Layers size={14} /> {b.floor_count || 0} Floors
                          </small>
                        </div>
                      </div>

                      <ChevronRight className="text-muted" size={20} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===== COMPLETE PROFILE MODAL ===== */}
      {showCompleteProfile && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center z-3">
          <div className="bg-white rounded-4 w-100 h-100 position-relative">
            <button
              className="btn position-absolute top-0 end-0 m-3"
              onClick={() => setShowCompleteProfile(false)}
            >
              <X size={22} />
            </button>

            <EmployeeRegister
              initialStep={4}
              initialEmail={data?.email}
            />
          </div>
        </div>
      )}

      {/* ===== STYLING ===== */}
      <style>{`
        .building-card {
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .building-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }
      `}</style>
    </>
  );
}
