import {
  Utensils,
  Layers,
  Sparkles,
  ArrowLeft,
  MapPin,
  Menu,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVendorBranches } from "../../../api/vendor";
import BranchFoods from "../sections/BranchFoods";
import BranchFloors from "../sections/BranchFloors";
import BranchSpecialFoods from "../sections/BranchSpecialFoods";
import TodayMenu from "./floors/TodayMenu";

export default function VendorBranchDetails() {
  const { branchId } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState("foods");
  const [branch, setBranch] = useState(null);

  useEffect(() => {
    const loadBranch = async () => {
      try {
        const res = await getVendorBranches();
        const found = res.data.find((b) => String(b.id) === String(branchId));
        setBranch(found);
      } catch (err) {
        console.error("Failed to load branch info", err);
      }
    };

    loadBranch();
  }, [branchId]);

  return (
    <div className="container">
      {/* HEADER */}
      <div className="d-flex align-items-start justify-content-between mb-3">
        {/* TITLE */}
        <div>
          <h4 className="fw-bold mb-0">
            <span
              className="px-2 py-1 rounded"
              style={{ background: "rgba(13,110,253,0.08)", color: "#0d6efd" }}
            >
              {branch ? branch.branch_name : "Branch"}
            </span>{" "}
            Control Center
          </h4>

          {branch && (
            <div className="text-muted small d-flex align-items-center gap-1">
              <MapPin size={13} />
              {branch.city}, {branch.state}
            </div>
          )}
        </div>

        {/* BACK BUTTON RIGHT */}
        <button
          className="btn btn-light btn-sm"
          onClick={() => navigate(-1)}
          title="Go back"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* TABS */}
      <div className="btn-group mb-4">
        <button
          className={`btn btn-sm ${
            tab === "foods" ? "btn-primary" : "btn-light"
          }`}
          onClick={() => setTab("foods")}
        >
          <Utensils size={14} /> Foods
        </button>

        <button
          className={`btn btn-sm ${
            tab === "companies" ? "btn-primary" : "btn-light"
          }`}
          onClick={() => setTab("companies")}
        >
          <Layers size={14} /> Companies
        </button>
      </div>

      {tab === "foods" && <BranchFoods branchId={branchId} />}
      {tab === "companies" && <BranchFloors branchId={branchId} />}
    </div>
  );
}
