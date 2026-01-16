import { useEffect, useState } from "react";
import { PlusCircle, Trash2, Calendar, Pencil } from "lucide-react";
import {
  getDailyMenu,
  getFloorFoods,
  saveMenuItem,
  updateMenuItem,
  deleteDailyMenuItem,
} from "../../../../api/menu";
import MenuItemModal from "./MenuItemModal";

const WEEK_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const getTodayDay = () => {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[new Date().getDay()];
};

export default function ManageMenu({ floorId }) {
  const [day, setDay] = useState(getTodayDay);
  const [menu, setMenu] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const m = await getDailyMenu(floorId, day);
      const f = await getFloorFoods(floorId);
      setMenu(m.data);
      setFoods(f.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (floorId) loadMenu();
  }, [day, floorId]);

  const openAdd = (food) => {
    // Prefill modal from FloorFood object
    setSelectedFood({
      ...food,
      special_name_override: food.name_override,
      special_price_override_cents: food.floor_level_price_override_cents,
      remaining_quantity: food.default_quantity,
      is_available: true,
    });
    setEditItem(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    // Prefill modal from DailyMenuItem object
    setSelectedFood({
      id: item.floor_food,
      food_name: item.food_name,
      special_name_override: item.special_name_override || item.food_name,
      special_price_override_cents: item.special_price_override_cents,
      remaining_quantity: item.remaining_quantity,
      is_available: item.is_available,
    });
    setEditItem(item);
    setShowModal(true);
  };

  if (loading) return <div className="text-muted">Loading menu...</div>;

  const usedIds = (menu?.daily_items || []).map((i) => i.floor_food);
  const availableFoods = foods.filter((f) => !usedIds.includes(f.id));

  return (
    <>
      <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
        <Calendar size={18} /> Weekly Menu
      </h5>

      {/* WEEKDAY GRID */}
      <div className="row g-2 mb-4">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="col-4 col-md-2">
            <button
              className={`btn btn-sm w-100 ${
                day === d ? "btn-primary" : "btn-light"
              }`}
              onClick={() => setDay(d)}
            >
              {d.slice(0, 3).toUpperCase()}
            </button>
          </div>
        ))}
      </div>

      <div className="row">
        {/* MENU ITEMS */}
        <div className="col-lg-6 mb-3">
          <h6 className="fw-bold">Menu Items</h6>

          {!menu?.daily_items?.length && (
            <div className="alert alert-light">No food added for this day</div>
          )}

          {menu?.daily_items?.map((i) => (
            <div
              key={i.id}
              className="card p-3 mb-2 shadow-sm rounded-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
            >
              <div>
                <div className="fw-semibold">
                  {i.special_name_override || i.food_name}
                </div>
                <div className="small text-muted">
                  ₹{i.special_price_override_cents || i.floor_food_price_cents}{" "}
                  · Qty: {i.remaining_quantity || "∞"} ·{" "}
                  {i.is_available ? "Available" : "Unavailable"}
                </div>
              </div>
              <div className="mt-2 mt-md-0 d-flex gap-2">
                <Pencil
                  size={16}
                  className="text-warning cursor-pointer"
                  onClick={() => openEdit(i)}
                />
                <Trash2
                  size={16}
                  className="text-danger cursor-pointer"
                  onClick={() =>
                    window.confirm("Are you sure to delete this item?") &&
                    deleteDailyMenuItem(i.id).then(loadMenu)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* ADD FOOD */}
        <div className="col-lg-6 mb-3">
          <h6 className="fw-bold">Add Food</h6>

          {!availableFoods.length && (
            <div className="text-muted">All foods already added</div>
          )}

          {availableFoods.map((f) => (
            <div
              key={f.id}
              className="card p-3 mb-2 shadow-sm rounded-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
            >
              <div>
                <div className="fw-semibold">
                  {f.name_override || f.food_name}
                </div>
                <div className="small text-muted">
                  ₹{f.floor_level_price_override_cents || f.food_price_cents} ·
                  Qty: {f.default_quantity} <br />
                  {f.description_override || f.food_description}
                </div>
              </div>
              <div className="mt-2 mt-md-0">
                <PlusCircle
                  size={18}
                  className="text-primary cursor-pointer"
                  onClick={() => openAdd(f)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <MenuItemModal
        show={showModal}
        onClose={() => setShowModal(false)}
        food={selectedFood}
        editItem={editItem}
        menuId={menu?.id}
        reload={loadMenu}
      />
    </>
  );
}
