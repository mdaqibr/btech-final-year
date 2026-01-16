import { useEffect, useState } from "react";
import { Layers, Plus, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import {
  getDailyMenu,
  addFoodToDailyMenu,
  toggleMenuItem,
  deleteMenuItem,
} from "../../api/menu";

const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function FloorDailyMenuManager({ floorId }) {
  const [day, setDay] = useState("monday");
  const [menu, setMenu] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, [day, floorId]);

  const fetchMenu = () => {
    setLoading(true);
    getDailyMenu(floorId, day)
      .then((res) => {
        setMenu(res.data);
        setItems(res.data.daily_items || []);
      })
      .catch(() => setMsg("Failed to load daily menu"))
      .finally(() => setLoading(false));
  };

  const handleAddFood = (foodId) => {
    addFoodToDailyMenu(menu.id, foodId)
      .then(() => {
        setMsg("Food added successfully");
        fetchMenu();
      })
      .catch(() => setMsg("Food already exists in menu"));
  };

  const handleToggle = (item) => {
    toggleMenuItem(item.id, !item.is_available).then(fetchMenu);
  };

  const handleDelete = (id) => {
    deleteMenuItem(id).then(fetchMenu);
  };

  return (
    <>
      {/* WEEKDAY SELECTOR */}
      <div className="btn-group mb-4">
        {WEEKDAYS.map((d) => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={`btn btn-sm ${day === d ? "btn-primary" : "btn-light"}`}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      {loading && <div className="text-muted">Loading menu...</div>}

      {msg && (
        <div className="alert alert-info d-flex align-items-center gap-2">
          <AlertTriangle size={16} /> {msg}
        </div>
      )}

      {!items.length && !loading && (
        <div className="alert alert-warning">
          <Layers size={16} className="me-2" />
          No food added for this day
        </div>
      )}

      {/* MENU ITEMS */}
      {items.map((item) => (
        <div
          key={item.id}
          className="card p-2 mb-2 d-flex justify-content-between align-items-center flex-row"
        >
          <div>
            <strong>{item.floor_food.food_name}</strong>
            <div className="text-muted small">
              {item.is_available ? "Available" : "Unavailable"}
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              className={`btn btn-sm ${
                item.is_available ? "btn-success" : "btn-outline-secondary"
              }`}
              onClick={() => handleToggle(item)}
            >
              <CheckCircle size={14} />
            </button>

            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDelete(item.id)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
