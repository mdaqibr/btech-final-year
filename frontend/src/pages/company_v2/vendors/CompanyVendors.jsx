import React, { useEffect, useState } from "react";
import { getCompanyVendors } from "../../../api/company_v2";
import VendorCard from "../../../components/company/VendorCard";

const CompanyVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await getCompanyVendors();
      setVendors(res.data);
      console.log("vendors: ", res.data)
    } catch (err) {
      console.error("Error fetching vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading vendors...</p>;

  return (
    <div className="container py-4">
      <h3>My Vendors</h3>
      <div className="row">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="col-md-4 mb-3">
            <VendorCard vendor={vendor} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyVendors;
