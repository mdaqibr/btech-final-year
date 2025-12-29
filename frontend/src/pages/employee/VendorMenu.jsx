import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Coffee, Utensils, Cookie, Star } from "lucide-react";

export default function VendorMenu() {
  const { vendorId } = useParams();
  const navigate = useNavigate();

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
          <h5 className="fw-bold mb-0">Today's Menu</h5>
          <small className="text-muted">Choose your meal type</small>
        </div>
      </div>

      {/* SPECIAL MEAL */}
      <div className="card border-0 shadow-sm bg-danger-subtle mb-4">
        <div className="card-body d-flex align-items-center justify-content-between">
          <div className="d-flex gap-2 align-items-center">
            <Star className="text-danger" />
            <div>
              <h6 className="fw-bold mb-0">Special Dish Today 🎉</h6>
              <small className="text-muted">
                Chef's surprise meal available now!
              </small>
            </div>
          </div>
          <button className="btn btn-danger btn-sm">Order Now</button>
        </div>
      </div>

      {/* MEALS */}
      <div className="row g-4">
        {[
          { name: "Breakfast", icon: <Coffee />, color: "bg-warning-subtle" },
          { name: "Lunch", icon: <Utensils />, color: "bg-success-subtle" },
          { name: "Evening Snacks", icon: <Cookie />, color: "bg-info-subtle" },
        ].map((m, i) => (
          <div key={i} className="col-12 col-md-4">
            <div className={`card border-0 shadow-sm ${m.color}`}>
              <div className="card-body text-center">
                <div className="bg-white rounded-circle d-inline-flex p-3 shadow-sm mb-2">
                  {m.icon}
                </div>
                <h6 className="fw-semibold">{m.name}</h6>
                <button className="btn btn-outline-primary btn-sm mt-2">
                  View Items →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
