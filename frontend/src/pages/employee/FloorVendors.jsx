import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Store, Clock, Star, ChevronRight, ArrowLeft } from "lucide-react";
import { getFloorVendors } from "../../api/employee";

export default function FloorVendors() {
  const { floorId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    getFloorVendors(floorId).then((res) => setData(res.data));
  }, [floorId]);

  if (!data)
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );

  const hasVendors = data.vendors && data.vendors.length > 0;
  const accentList = ["border-primary", "border-success", "border-warning", "border-info"];

  return (
    <div className="container-fluid px-2 px-md-4 py-3">
      {/* HEADER */}
      <div className="mb-4 d-flex align-items-center gap-2">
        <button
          className="btn btn-light border-0 p-2 shadow-sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h5 className="fw-bold d-flex align-items-center gap-2 mb-0">
            <Store size={22} className="text-primary" />
            {data.floor_name}
          </h5>
          <p className="text-muted small mb-0">
            {hasVendors
              ? "Tap on a vendor to view menu & services"
              : "No vendors are currently available on this floor"}
          </p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {!hasVendors && (
        <div className="card border-0 shadow-sm bg-warning-subtle text-center p-4">
          <div className="d-flex justify-content-center mb-2">
            <div className="bg-white rounded-circle p-3 shadow-sm">
              <Store size={32} className="text-warning" />
            </div>
          </div>
          <h6 className="fw-semibold mb-1">No Vendors Available</h6>
          <p className="text-muted small mb-0">
            No vendor has started service on this floor yet.
          </p>
        </div>
      )}

      {/* VENDOR CARDS */}
      {hasVendors && (
        <div className="row g-3 g-lg-4">
          {data.vendors.map((v, i) => (
            <div key={v.id} className="col-12 col-sm-6 col-lg-4">
              <div
                role="button"
                onClick={() =>
                  navigate(`/employee/floors/${floorId}/vendors/${v.branch_id}/menu`)
                }
                className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative vendor-card-1"
              >
                {/* Accent strip on top */}
                <div className={`position-absolute top-0 start-0 w-100 border-top border-4 ${accentList[i % 4]}`} />

                <div className="card-body d-flex flex-column justify-content-between p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-white rounded-3 p-3 shadow-sm d-flex align-items-center justify-content-center">
                      <Store size={22} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1 text-truncate">{v.vendor_name}</h6>
                      <small className="text-muted d-block text-truncate">
                        {v.branch_name}, {v.city}
                      </small>
                      <div className="d-flex align-items-center gap-2 small text-muted mt-1">
                        <Clock size={14} />
                        {v.opening} – {v.closing}
                      </div>
                      {v.special_meal && (
                        <div className="mt-1 small text-success d-flex gap-1 fw-semibold">
                          <Star size={14} />
                          {v.special_meal}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-end">
                    <ChevronRight className="text-muted" size={20} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== STYLING ===== */}
      <style>{`
        .vendor-card-1 {
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .vendor-card-1:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }
      `}</style>
    </div>
  );
}
