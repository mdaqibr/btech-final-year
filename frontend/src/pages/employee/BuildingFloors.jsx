import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layers, ChevronRight, ArrowLeft } from "lucide-react";
import { getBuildingFloors } from "../../api/employee";

export default function BuildingFloors() {
  const { buildingId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    getBuildingFloors(buildingId).then((res) => setData(res.data));
  }, [buildingId]);

  if (!data)
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );

  const hasFloors = data.floors && data.floors.length > 0;

  return (
    <div className="container-fluid px-2 px-md-4 py-3">
      {/* HEADER */}
      <div className="mb-4 d-flex align-items-center gap-2">
        <button
          className="btn btn-light border-0 p-2 shadow-sm"
          onClick={() => navigate("/employee/dashboard")}
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h5 className="fw-bold d-flex align-items-center gap-2 mb-0">
            <Layers size={22} className="text-primary" />
            {data.building_name}
          </h5>
          <p className="text-muted small mb-0">
            {hasFloors
              ? "Tap on a floor to view available services"
              : "This building is set up, but no floors have been added yet"}
          </p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {!hasFloors && (
        <div className="card border-0 shadow-sm bg-info-subtle text-center p-4">
          <div className="d-flex justify-content-center mb-2">
            <div className="bg-white rounded-circle p-3 shadow-sm">
              <Layers size={32} className="text-primary" />
            </div>
          </div>
          <h6 className="fw-semibold mb-1">No Floors Found</h6>
          <p className="text-muted small mb-0">
            Please contact your administrator to add floors to this building.
          </p>
        </div>
      )}

      {/* FLOORS */}
      {hasFloors && (
        <div className="row g-3 g-lg-4">
          {data.floors.map((f, index) => {
            const accentList = [
              "border-primary",
              "border-success",
              "border-warning",
              "border-info",
            ];

            return (
              <div key={f.id} className="col-12 col-sm-6 col-lg-4">
                <div
                  role="button"
                  onClick={() =>
                    navigate(`/employee/floors/${f.id}/vendors`)
                  }
                  className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative floor-card"
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
                        <Layers size={22} className="text-primary" />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1 text-truncate">{f.name}</h6>
                        <small className="text-muted d-block">
                          Floor No: {f.floor_number}
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

      {/* ===== STYLING ===== */}
      <style>{`
        .floor-card {
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .floor-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }
      `}</style>
    </div>
  );
}
