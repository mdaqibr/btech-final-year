import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api"; // prefix for all new APIs

// 1. Fetch all vendors for this company
export const getCompanyVendors = async () => {
  return await axios.get(`${BASE_URL}/vendor/company-vendors`);
};

// 2. Fetch single vendor details
export const getVendorDetails = async (vendorId) => {
  return await axios.get(`${BASE_URL}/vendors/${vendorId}/`);
};

// 3. Add new vendor from marketplace
export const addVendor = async (vendorId) => {
  return await axios.post(`${BASE_URL}/vendors/add/`, { vendor_id: vendorId });
};

// 4. Vendor performance stats
export const getVendorPerformance = async (vendorId) => {
  return await axios.get(`${BASE_URL}/vendors/${vendorId}/performance/`);
};

// 5. Fetch available vendors in marketplace
export const getAvailableVendors = async () => {
  return await axios.get(`${BASE_URL}/vendors/available/`);
};
