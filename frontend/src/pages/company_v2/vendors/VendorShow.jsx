import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVendorDetails } from "../../../api/company_v2";

const VendorShow = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    fetchVendor();
  }, []);

  const fetchVendor = async () => {
    try {
      const res = await getVendorDetails(id);
      setVendor(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!vendor) return <p>Loading vendor details...</p>;

  return (
    <div className="container py-4">
      <h3>{vendor.name}</h3>
      <p><strong>Email:</strong> {vendor.email}</p>
      <p><strong>Phone:</strong> {vendor.phone}</p>
      <p><strong>Industry:</strong> {vendor.industry}</p>
      <p><strong>Status:</strong> {vendor.status}</p>
    </div>
  );
};

export default VendorShow;
