import React, { useEffect, useState } from "react";
import { getAvailableVendors, addVendor } from "../../../api/company_v2";

const AvailableVendors = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetchAvailableVendors();
  }, []);

  const fetchAvailableVendors = async () => {
    try {
      const res = await getAvailableVendors();
      setVendors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddVendor = async (id) => {
    try {
      await addVendor(id);
      alert("Vendor added successfully!");
      fetchAvailableVendors();
    } catch (err) {
      console.error(err);
      alert("Failed to add vendor.");
    }
  };

  return (
    <div className="container py-4">
      <h3>Available Vendors</h3>
      <div className="row">
        {vendors.map((v) => (
          <div key={v.id} className="col-md-4 mb-3">
            <div className="card p-3 shadow-sm">
              <h5>{v.name}</h5>
              <p className="text-muted">{v.industry}</p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleAddVendor(v.id)}
              >
                Add Vendor
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableVendors;
