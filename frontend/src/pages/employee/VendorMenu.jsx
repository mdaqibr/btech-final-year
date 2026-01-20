// src/pages/employee/VendorMenu.jsx
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Coffee, Utensils, Cookie, Star, Moon, ShoppingCart } from "lucide-react";

export default function VendorMenu() {
  const { floorId, vendorBranchId } = useParams();
  const navigate = useNavigate();

  const mealTypes = [
    {
      key: "breakfast",
      name: "Breakfast",
      icon: <Coffee />,
      color: "bg-warning-subtle",
    },
    {
      key: "lunch",
      name: "Lunch",
      icon: <Utensils />,
      color: "bg-success-subtle",
    },
    {
      key: "evening_snacks",
      name: "Evening Snacks",
      icon: <Cookie />,
      color: "bg-info-subtle",
    },
    {
      key: "dinner",
      name: "Dinner",
      icon: <Moon />,
      color: "bg-primary-subtle",
    },
  ];

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
          <h5 className="fw-bold mb-0">Today's Menu</h5>
          <p className="text-muted small mb-0">Choose your meal type</p>
        </div>
      </div>

      {/* SPECIAL MEAL */}
      <div className="card border-0 shadow-sm bg-danger-subtle mb-4 position-relative special-meal-card">
        <div className="position-absolute top-0 start-0 w-100 border-top border-4 border-danger"></div>
        <div className="card-body d-flex align-items-center justify-content-between">
          <div className="d-flex gap-2 align-items-center">
            <Star className="text-danger" size={22} />
            <div>
              <h6 className="fw-bold mb-0">Special Dish Today 🎉</h6>
              <small className="text-muted d-block">
                Chef's surprise meal available now!
              </small>
            </div>
          </div>
          <button
            className="btn btn-danger btn-sm"
            onClick={() =>
              navigate(
                `/employee/floors/${floorId}/vendors/${vendorBranchId}/today-menu/special`
              )
            }
          >
            Order Now
          </button>
        </div>
      </div>

      {/* MEALS */}
      <div className="row g-3 g-lg-4">
        {mealTypes.map((meal, i) => (
          <div key={meal.key} className="col-12 col-sm-6 col-lg-4">
            <div
              role="button"
              onClick={() =>
                navigate(
                  `/employee/floors/${floorId}/vendors/${vendorBranchId}/today-menu/${meal.key}`
                )
              }
              className={`card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative meal-card ${meal.color}`}
            >
              {/* Accent Strip */}
              <div
                className={`position-absolute top-0 start-0 w-100 border-top border-4 ${
                  ["border-warning", "border-success", "border-info", "border-primary"][i % 4]
                }`}
              />

              <div className="card-body d-flex flex-column align-items-center justify-content-center p-4 text-center">
                <div className="bg-white rounded-circle d-inline-flex p-3 shadow-sm mb-3">
                  {meal.icon}
                </div>
                <h6 className="fw-bold mb-2">{meal.name}</h6>
                <button className="btn btn-outline-primary btn-sm mt-auto">
                  View Items →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CART CTA */}
      <div
        className="d-flex flex-column align-items-center justify-content-center mt-5 p-4 shadow-sm rounded-4"
        style={{
          backgroundColor: "#e7f1ff",
        }}
      >
        <ShoppingCart size={32} style={{ color: "#0d6efd", marginBottom: "1rem" }} />
        <h6
          style={{
            fontWeight: "600",
            color: "#0d6efd",
            marginBottom: "0.75rem",
          }}
        >
          Ready to Order?
        </h6>
        <p style={{ color: "#6c757d", marginBottom: "1.5rem" }}>
          Check your cart anytime
        </p>
        <button
          onClick={() =>
            navigate(`/employee/your-cart`)
          }
          style={{
            border: "none",
            borderRadius: "0.75rem",
            backgroundColor: "#0d6efd",
            color: "#fff",
            padding: "0.75rem 2rem",
            fontWeight: "600",
            margin: "0 0.5rem",
            boxShadow: "0 0.25rem 0.75rem rgba(13,110,253,0.3)",
          }}
        >
          View Cart
        </button>
      </div>

      {/* ===== STYLING ===== */}
      <style>{`
        .meal-card, .special-meal-card {
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .meal-card:hover, .special-meal-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }
      `}</style>
    </div>
  );
}
