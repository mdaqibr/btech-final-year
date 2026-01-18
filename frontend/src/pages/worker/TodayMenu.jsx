import { useEffect, useState } from "react";
import {
  fetchTodayMenu,
  toggleMenuAvailability,
} from "../../api/worker";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function TodayMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    setLoading(true);
    try {
      const data = await fetchTodayMenu();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    setUpdating((p) => ({ ...p, [id]: true }));
    try {
      await toggleMenuAvailability(id);
      loadMenu();
    } finally {
      setUpdating((p) => ({ ...p, [id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Loader2 className="spin" size={36} />
        <p className="mt-2">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">Today's Menu</h3>

      {items.map((i) => (
        <div
          key={i.id}
          className="card mb-2 border-0 shadow-sm rounded-3"
        >
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-0">{i.name}</h6>
              <small className="text-muted text-uppercase">
                {i.type}
              </small>
            </div>

            <button
              className={`btn btn-sm d-flex align-items-center gap-1 ${
                i.is_available ? "btn-success" : "btn-danger"
              }`}
              disabled={updating[i.id]}
              onClick={() => handleToggle(i.id)}
            >
              {updating[i.id] ? (
                <Loader2 size={16} className="spin" />
              ) : i.is_available ? (
                <>
                  <CheckCircle size={16} /> Available
                </>
              ) : (
                <>
                  <XCircle size={16} /> Unavailable
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
