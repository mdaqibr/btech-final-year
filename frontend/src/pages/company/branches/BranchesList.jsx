// src/pages/company/branches/BranchesList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import EntityCard from "../../../components/common/EntityCard";
import AddBranchModal from "./AddBranchModal";
import { getBranches } from "../../../api/branches";

const BranchesList = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const data = await getBranches();
      // normalize: if backend returns {data: {branches: [...]}} handle it
      const items = Array.isArray(data) ? data : (data?.branches || data?.data || []);
      setBranches(items);
    } catch (err) {
      console.error("branches fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ minHeight: "72vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Your Branches</h2>
          <p className="text-muted small mb-0">Select a branch to manage buildings & floors</p>
        </div>

        <div>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowAdd(true)}>
            <PlusCircle size={16} /> Add Branch
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">Loading branches…</div>
      ) : (
        <div className="row g-3">
          {branches.length === 0 && (
            <div className="col-12">
              <div className="p-4 text-center rounded shadow-sm" style={{ background: "linear-gradient(135deg,#fff8f0,#fff)" }}>
                <h5 className="mb-2">No branches yet</h5>
                <p className="text-muted">Add your first branch to get started.</p>
                <button className="btn btn-outline-primary" onClick={() => setShowAdd(true)}>Create Branch</button>
              </div>
            </div>
          )}

          {branches.map((b) => (
            <div key={b.id} className="col-12 col-md-6 col-lg-4">
              <EntityCard
                title={b.branch_name || b.name || "Unnamed Branch"}
                subtitle={`${b.city || ""} • ${b.state || ""} • ${b.country || ""}`}
                badge={b.company_count ? `${b.company_count} buildings` : undefined}
                accent="linear-gradient(135deg,#f0f8ff,#e8f5ff)"
                onClick={() => navigate(`/company/branches/${b.id}/buildings`)}
              />
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <AddBranchModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false);
            fetchBranches();
          }}
        />
      )}
    </div>
  );
};

export default BranchesList;