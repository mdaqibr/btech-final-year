import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Store, Clock, ArrowLeft, Star, ChevronRight } from "lucide-react";
import { getFloorVendors } from "../../api/employee";

export default function FloorVendors() {
  const { floorId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    getFloorVendors(floorId).then((res) => setData(res.data));
  }, [floorId]);

  if (!data)
    return <div className="spinner-border text-primary d-block mx-auto mt-5" />;

  return (
    <>
      {/* HEADER */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="btn btn-light shadow-sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
        </button>

        <div>
          <h5 className="fw-bold mb-0">{data.floor_name}</h5>
          <small className="text-muted">Choose your Cafeteria Partner</small>
        </div>
      </div>

      {/* EMPTY */}
      {data.vendors.length === 0 && (
        <div className="card border-0 shadow-sm bg-warning-subtle p-4 text-center">
          <Store size={36} className="text-warning mb-2" />
          <h6>No Vendors Available</h6>
          <small className="text-muted">
            No vendor has started service on this floor yet.
          </small>
        </div>
      )}

      {/* LIST */}
      <div className="row g-4">
        {data.vendors.map((v, i) => (
          <div key={v.id} className="col-12 col-md-6 col-lg-4">
            <div
              className={`card border-0 shadow-sm h-100 ${
                [
                  "bg-primary-subtle",
                  "bg-success-subtle",
                  "bg-info-subtle",
                  "bg-warning-subtle",
                ][i % 4]
              }`}
            >
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-semibold mb-0 d-flex gap-2 align-items-center">
                      <Store size={18} className="text-primary" />
                      {v.vendor_name}
                    </h6>
                    <ChevronRight
                      className="text-muted cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/employee/floors/${floorId}/vendors/${v.id}/menu`
                        )
                      }
                    />
                  </div>

                  <p className="text-muted small mb-1">
                    {v.branch_name}, {v.city}
                  </p>

                  <div className="d-flex align-items-center gap-2 small text-muted">
                    <Clock size={14} />
                    {v.opening} – {v.closing}
                  </div>

                  {v.special_meal && (
                    <div className="mt-2 small text-success d-flex gap-1 fw-semibold">
                      <Star size={14} />
                      {v.special_meal}
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-outline-primary btn-sm mt-3"
                  onClick={() =>
                    navigate(`/employee/floors/${floorId}/vendors/${v.id}/menu`)
                  }
                >
                  View Menu
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
