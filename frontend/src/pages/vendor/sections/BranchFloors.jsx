// src/pages/vendor/sections/BranchFloors.jsx
import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Building2,
  Info,
  Layers,
  Utensils,
  Sparkles,
} from "lucide-react";
import { getVendorOnboardedStructure } from "../../../api/vendor";
import FloorFoodSetup from "../FloorFoodSetup";
import ManageMenu from "../branches/floors/ManageMenu";
import SpecialFood from "../branches/floors/SpecialFood";

export default function BranchFloors({ branchId }) {
  const [raw, setRaw] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [floors, setFloors] = useState([]);

  const [company, setCompany] = useState(null);
  const [branch, setBranch] = useState(null);
  const [floor, setFloor] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("manageFood");

  const branchRef = useRef(null);
  const floorRef = useRef(null);
  const setupRef = useRef(null);

  // Fetch vendor onboarded structure
  useEffect(() => {
    if (!branchId) {
      setError("Branch not selected");
      setLoading(false);
      return;
    }

    setLoading(true);
    getVendorOnboardedStructure(branchId)
      .then((res) => {
        setRaw(res.data || []);
        setError(null);

        const uniqCompanies = Object.values(
          (res.data || []).reduce((acc, c) => {
            acc[c.company_id] = c;
            return acc;
          }, {})
        );
        setCompanies(uniqCompanies);
      })
      .catch((err) => {
        setError("Failed to fetch structure");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [branchId]);

  // Company selection
  const selectCompany = (c) => {
    setCompany(c);
    setBranch(null);
    setFloor(null);

    const uniqBranches = Object.values(
      raw
        .filter((r) => r.company_id === c.company_id)
        .reduce((acc, b) => {
          acc[b.branch_id] = b;
          return acc;
        }, {})
    );

    setBranches(uniqBranches);
    setTimeout(
      () => branchRef.current?.scrollIntoView({ behavior: "smooth" }),
      200
    );
  };

  // Branch selection
  const selectBranch = (b) => {
    setBranch(b);
    setFloor(null);

    const uniqFloors = Object.values(
      raw
        .filter((r) => r.branch_id === b.branch_id)
        .reduce((acc, f) => {
          acc[f.floor_id] = f;
          return acc;
        }, {})
    );

    setFloors(uniqFloors);
    setTimeout(
      () => floorRef.current?.scrollIntoView({ behavior: "smooth" }),
      200
    );
  };

  // Floor selection
  const selectFloor = (f) => {
    setFloor({
      floor_id: f.floor_id,
      vendor_branch_id: f.vendor_branch_id,
    });
    setTab("manageFood"); // Reset tab to Manage Food
    setTimeout(
      () => setupRef.current?.scrollIntoView({ behavior: "smooth" }),
      200
    );
  };

  if (loading)
    return (
      <div className="text-center py-5 text-muted">
        <Layers size={24} className="mb-2" />
        Loading floors...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-5 text-danger">
        <Info size={24} className="mb-2" />
        {error}
      </div>
    );

  if (!raw.length)
    return (
      <div className="text-center py-5 text-muted">
        <Building2 size={24} className="mb-2" />
        No data available for this branch
      </div>
    );

  return (
    <>
      <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
        <Layers size={20} /> Company Floor Setup
      </h5>

      {/* Companies */}
      <div className="row g-3">
        {companies.map((c) => (
          <div key={c.company_id} className="col-md-4">
            <div
              className={`card p-3 shadow-sm cursor-pointer ${
                company?.company_id === c.company_id ? "border-primary" : ""
              }`}
              onClick={() => selectCompany(c)}
            >
              <div className="fw-bold text-primary">{c.company_name}</div>
              <div className="text-muted small d-flex align-items-center gap-1">
                <MapPin size={12} /> {c.company_location}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Branches */}
      {company && (
        <div ref={branchRef} className="mt-5">
          <h6 className="fw-bold d-flex align-items-center gap-2">
            <MapPin size={16} /> {company.company_name} Branches
          </h6>
          <div className="row g-3">
            {branches.map((b) => (
              <div key={b.branch_id} className="col-md-4">
                <div
                  className={`card p-3 cursor-pointer ${
                    branch?.branch_id === b.branch_id ? "border-success" : ""
                  }`}
                  onClick={() => selectBranch(b)}
                >
                  <div className="fw-semibold">{b.branch_name}</div>
                  <div className="text-muted small">
                    {b.branch_city}, {b.branch_state}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floors */}
      {branch && (
        <div ref={floorRef} className="mt-5">
          <h6 className="fw-bold d-flex align-items-center gap-2">
            <Building2 size={16} /> {branch.branch_name} Floors
          </h6>
          <div className="row g-3">
            {floors.map((f) => (
              <div key={f.floor_id} className="col-md-3">
                <div
                  className={`card p-2 text-center cursor-pointer ${
                    floor?.floor_id === f.floor_id ? "border-warning" : ""
                  }`}
                  onClick={() => selectFloor(f)}
                >
                  {f.floor_name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floor Tabs & Content */}
      {floor && (
        <div ref={setupRef} className="mt-5">
          {/* TABS */}
          <div className="btn-group mb-4">
            <button
              className={`btn btn-sm ${
                tab === "manageFood" ? "btn-primary" : "btn-light"
              }`}
              onClick={() => setTab("manageFood")}
            >
              <Utensils size={14} /> Manage Food
            </button>
            <button
              className={`btn btn-sm ${
                tab === "manageMenu" ? "btn-primary" : "btn-light"
              }`}
              onClick={() => setTab("manageMenu")}
            >
              <Layers size={14} /> Manage Menu
            </button>
            <button
              className={`btn btn-sm ${
                tab === "specialFood" ? "btn-primary" : "btn-light"
              }`}
              onClick={() => setTab("specialFood")}
            >
              <Sparkles size={14} /> Special Food
            </button>
          </div>

          {/* TAB CONTENT */}
          {tab === "manageFood" && (
            <>
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <Utensils size={16} /> Manage Foods for {branch.branch_name}
              </h5>
              <FloorFoodSetup
                floorId={floor.floor_id}
                vendorBranchId={floor.vendor_branch_id}
              />
            </>
          )}

          {tab === "manageMenu" && (
            <>
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <Layers size={16} /> Manage Menu for {branch.branch_name}
              </h5>

              <ManageMenu floorId={floor.floor_id} />
            </>
          )}

          {tab === "specialFood" && (
            <>
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <Layers size={16} /> Manage special foods on
                {branch.branch_name}
              </h5>

              <SpecialFood floorId={floor.floor_id} branchId={branchId} />
            </>
          )}
        </div>
      )}
    </>
  );
}
