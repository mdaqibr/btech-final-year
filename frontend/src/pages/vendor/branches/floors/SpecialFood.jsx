import { useEffect, useState } from "react";
import {
  PlusCircle,
  Trash2,
  Pencil,
  IndianRupee,
  Leaf,
  Drumstick,
  Clock,
  CalendarDays,
  FileText,
  Tag,
  ToggleLeft,
} from "lucide-react";
import {
  getSpecialFoods,
  addSpecialFood,
  updateSpecialFood,
  deleteSpecialFood,
} from "../../../../api/menu";

export default function SpecialFood({ floorId, branchId }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price_cents: "",
    category: "veg",
    available_from: "",
    available_to: "",
    is_available: true,
  });

  const formatDateTime = (dt) =>
    new Date(dt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const loadFoods = async () => {
    setLoading(true);
    try {
      const res = await getSpecialFoods(floorId);
      setFoods(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (floorId) loadFoods();
  }, [floorId]);

  const openModal = (food = null) => {
    if (food) {
      setEditingFood(food);
      setForm({
        name: food.name,
        description: food.description,
        price_cents: food.price_cents,
        category: food.category || "veg",
        available_from: food.available_from,
        available_to: food.available_to,
        is_available: food.is_available,
      });
    } else {
      setEditingFood(null);
      setForm({
        name: "",
        description: "",
        price_cents: "",
        category: "veg",
        available_from: "",
        available_to: "",
        is_available: true,
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const payload = { ...form, floor: floorId, vendor_branch: branchId };
    editingFood
      ? await updateSpecialFood(editingFood.id, payload)
      : await addSpecialFood(payload);
    setModalOpen(false);
    loadFoods();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this special food?")) return;
    await deleteSpecialFood(id);
    loadFoods();
  };

  return (
    <>
      <h5 className="fw-bold mb-3">Special Food</h5>
      {loading && <div className="text-muted">Loading...</div>}

      <div className="row g-4">
        {foods.map((food) => (
          <div key={food.id} className="col-md-4 col-sm-6">
            <div className="card border-0 shadow-lg rounded-4 h-100 bg-light">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-1">
                  <h6 className="fw-bold">{food.name}</h6>
                  <span
                    className={`badge ${
                      food.category === "veg"
                        ? "bg-success-subtle text-success"
                        : "bg-danger-subtle text-danger"
                    }`}
                  >
                    {food.category === "veg" ? (
                      <Leaf size={12} />
                    ) : (
                      <Drumstick size={12} />
                    )}{" "}
                    {food.category}
                  </span>
                </div>

                <p className="small text-muted">
                  <FileText size={14} className="me-1" />
                  {food.description}
                </p>

                <p className="fw-semibold mb-1">
                  <IndianRupee size={14} className="me-1" />
                  {food.price_cents}
                </p>

                <p className="small text-muted">
                  <Clock size={14} className="me-1" />
                  {formatDateTime(food.available_from)} to{" "}
                  {formatDateTime(food.available_to)}
                </p>

                <div className="d-flex justify-content-end gap-3 mt-3">
                  <Pencil
                    size={18}
                    className="text-primary cursor-pointer"
                    onClick={() => openModal(food)}
                  />
                  <Trash2
                    size={18}
                    className="text-danger cursor-pointer"
                    onClick={() => handleDelete(food.id)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="col-md-4 col-sm-6">
          <div
            className="card h-100 d-flex align-items-center justify-content-center border border-dashed text-primary cursor-pointer"
            onClick={() => openModal()}
          >
            <PlusCircle size={32} />
            <div className="fw-semibold mt-1">Add Special Food</div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="modal fade show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header">
                <h6 className="fw-bold">
                  <PlusCircle size={16} className="me-1" />
                  {editingFood ? "Edit Special Food" : "Add Special Food"}
                </h6>
                <button
                  className="btn-close"
                  onClick={() => setModalOpen(false)}
                />
              </div>

              <div className="modal-body row g-3">
                <div className="col-md-6">
                  <label className="form-label">
                    <Tag size={14} className="me-1" /> Name
                  </label>
                  <input
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    <IndianRupee size={14} className="me-1" /> Price
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.price_cents}
                    onChange={(e) =>
                      setForm({ ...form, price_cents: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-12">
                  <label className="form-label">
                    <FileText size={14} className="me-1" /> Description
                  </label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option value="veg">Veg</option>
                    <option value="non_veg">Non Veg</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    <CalendarDays size={14} className="me-1" /> Available From
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={form.available_from}
                    onChange={(e) =>
                      setForm({ ...form, available_from: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    <CalendarDays size={14} className="me-1" /> Available To
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={form.available_to}
                    onChange={(e) =>
                      setForm({ ...form, available_to: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6 form-check form-switch mt-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={form.is_available}
                    onChange={(e) =>
                      setForm({ ...form, is_available: e.target.checked })
                    }
                  />
                  <label className="form-check-label ms-2">Available</label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-light"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  {editingFood ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
