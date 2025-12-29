// src/pages/company/vendors/CompanyVendors.jsx
import React, { useEffect, useState } from "react";
import { Store, Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getVendors } from "../../../api/vendor";

const badgeColors = [
  "bg-primary",
  "bg-success",
  "bg-warning text-dark",
  "bg-info text-dark",
  "bg-secondary",
];

const CompanyVendors = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getVendors({ search, page }).then((res) => {
      setVendors(res.results);
      setMeta(res);
      setLoading(false);
    });
  }, [search, page]);

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Vendors Directory</h3>
        <p className="text-muted mb-3">
          Explore all vendors available in the system and view their service
          locations and associated companies.
        </p>

        {/* Search */}
        <div className="input-group">
          <span className="input-group-text bg-white">
            <Search size={18} />
          </span>
          <input
            className="form-control"
            placeholder="Search by vendor name, branch or city…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Vendors */}
      <div className="row g-3">
        {vendors.map((v) => (
          <div key={v.id} className="col-12 col-sm-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100 vendor-card">
              <div className="card-body d-flex flex-column">
                {/* Header */}
                <div className="d-flex gap-3 align-items-start mb-3">
                  <div
                    className="rounded d-flex align-items-center justify-content-center"
                    style={{ width: 52, height: 52, background: "#eef2ff" }}
                  >
                    {v.logo ? (
                      <img
                        src={v.logo}
                        alt={v.name}
                        className="img-fluid rounded"
                      />
                    ) : (
                      <Store size={24} />
                    )}
                  </div>
                  <div>
                    <h6 className="fw-semibold mb-1">{v.name}</h6>
                    <p className="small text-muted mb-0">
                      {v.branches.length} Branch(es)
                    </p>
                  </div>
                </div>

                {/* Branch badges */}
                <div className="mb-3">
                  {v.branches.slice(0, 4).map((b, i) => (
                    <span
                      key={b.id}
                      className={`badge me-1 mb-1 ${
                        badgeColors[i % badgeColors.length]
                      }`}
                    >
                      {b.city}
                    </span>
                  ))}
                  {v.branches.length > 4 && (
                    <span className="badge bg-light text-dark">
                      +{v.branches.length - 4} more
                    </span>
                  )}
                </div>

                {/* Action */}
                <button
                  className="btn btn-outline-primary mt-auto d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate(`/company/vendors/${v.id}`)}
                >
                  <Eye size={16} />
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center gap-2 mt-4">
        <button
          className="btn btn-sm btn-outline-secondary"
          disabled={!meta.previous}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>
        <button
          className="btn btn-sm btn-outline-secondary"
          disabled={!meta.next}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      <style>
        {`
          .vendor-card {
            transition: transform .18s ease, box-shadow .18s ease;
          }
          .vendor-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 12px 24px rgba(0,0,0,.08);
          }
        `}
      </style>
    </div>
  );
};

export default CompanyVendors;
