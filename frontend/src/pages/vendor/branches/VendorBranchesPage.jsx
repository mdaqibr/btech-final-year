import { useEffect, useState } from "react";
import { getVendorBranches } from "../../../api/vendor";
import { MapPin } from "lucide-react";

export default function VendorBranchesPage() {
  const [branches, setBranches] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getVendorBranches().then((res) => setBranches(res.data));
  }, []);

  const filtered = branches.filter(
    (b) =>
      b.city.toLowerCase().includes(query.toLowerCase()) ||
      b.branch_name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4 className="fw-bold">All Branches</h4>
        <input
          className="form-control w-25"
          placeholder="Search branch..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="row g-3">
        {filtered.map((b) => (
          <div key={b.id} className="col-md-4">
            <div className="vendor-card card p-3">
              <h6>{b.branch_name}</h6>
              <p className="text-muted small">
                <MapPin size={14} /> {b.city}, {b.state}
              </p>
              <span className="badge bg-primary">View Companies</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
