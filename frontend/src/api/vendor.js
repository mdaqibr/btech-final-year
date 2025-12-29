// src/api/vendor.js
const BASE_URL = "http://127.0.0.1:8000/api/accounts";

export const createVendorUser = async (email) => {
  const res = await fetch(`${BASE_URL}/vendor/register/create-user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

export const setPassword = async (email, password) => {
  const res = await fetch(`${BASE_URL}/vendor/register/set-password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const sendOTP = async (email) => {
  const res = await fetch(`${BASE_URL}/vendor/register/send-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

export const verifyOTP = async (email, otp) => {
  const res = await fetch(`${BASE_URL}/vendor/register/verify-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return res.json();
};

export const updateVendor = async (formData) => {
  const res = await fetch(`${BASE_URL}/vendor/register/update-vendor/`, {
    method: "POST",
    body: formData,
  });
  return res.json();
};

export const addVendorBranches = async (payload) => {
  const res = await fetch(`${BASE_URL}/vendor/register/add-branches/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

// Calling protected APIs.
import api from "./axios";

export const getVendors = ({ search = "", page = 1 }) =>
  api
    .get(`accounts/vendors/?search=${search}&page=${page}`)
    .then((res) => res.data);

export const getVendorDetail = (vendorId) =>
  api.get(`accounts/vendors/${vendorId}/`).then((res) => res.data);

export const getCompanyFloors = () =>
  api.get("accounts/company/floors/options/").then((res) => res.data);

export const requestVendorOnboard = (data) =>
  api.post("accounts/company/vendors/request/", data);

//  DASHBOARD

/* DASHBOARD STATS */
export const getVendorStats = () => api.get("accounts/vendor/dashboard/stats/");

/* BRANCHES */
export const getVendorBranches = () => api.get("accounts/vendor/branches/");

/* ONBOARD REQUESTS */
export const getVendorRequests = () =>
  api.get("accounts/vendor/company/requests/");

export const updateVendorRequest = (id, status) =>
  api.post(`accounts/vendor/company/requests/${id}/`, { status });

/* WORKERS */
// export const getVendorWorkers = () => api.get("accounts/vendor/workers/");

export const getVendorBranchesList = () => api.get("vendor/branches/");

export const createVendorBranch = (data) => api.post("vendor/branches/", data);
export const updateVendorBranch = (id, data) =>
  api.put(`vendor/branches/${id}/`, data);
export const deleteVendorBranch = (id) => api.delete(`vendor/branches/${id}/`);

export const getVendorWorkers = () => api.get("vendor/workers/");
export const createVendorWorkers = (data) => api.post("vendor/workers/", data);
export const updateVendorWorker = (id, data) =>
  api.put(`vendor/workers/${id}/`, data);
export const deleteVendorWorker = (id) => api.delete(`vendor/workers/${id}/`);
export const getApprovedFloors = () => api.get("vendor/approved-floors/");

// Manage foods
export const getVendorFoods = () => api.get("menu/vendor/foods/");
export const createVendorFood = (data) => api.post("menu/vendor/foods/", data);
export const updateVendorFood = (id, data) =>
  api.put(`menu/vendor/foods/${id}/`, data);
export const deleteVendorFood = (id) => api.delete(`menu/vendor/foods/${id}/`);

// Branch show page
export const getVendorBranchFoods = (branchId) =>
  api.get(`menu/vendor-branch-foods/${branchId}/`);
export const assignFoodToBranch = (branchId, payload) =>
  api.post(`menu/vendor-branch-foods/${branchId}/`, payload);
export const updateBranchFood = (id, payload) =>
  api.patch(`menu/vendor-branch-food/${id}/`, payload);
export const removeFoodFromBranch = (id) =>
  api.delete(`menu/vendor-branch-food/${id}/`);

export const getSpecialFoods = (bid) => api.get(`menu/special-foods/${bid}/`);
export const deleteSpecialFood = (id) =>
  api.delete(`menu/special-foods/item/${id}/`);

// not used
export const getBranchFoodsNotAssigned = (floorId) =>
  api.get(`vendor/floors/${floorId}/available-foods/`);

export const deleteFloorFood = (floorFoodId) =>
  api.delete(`vendor/floor-foods/${floorFoodId}/`);

export const getBranchFloorFoods = (floorId) =>
  api.get(`menu/floor-foods/${floorId}/`);
export const assignFoodToFloor = (floorId, payload) =>
  api.post(`menu/floor-foods/${floorId}/`, payload);
export const updateFloorFood = (id, payload) =>
  api.patch(`menu/floor-food/${id}/`, payload);
export const removeFoodFromFloor = (id) => api.delete(`menu/floor-food/${id}/`);

export const getBranchFoods = (branchId) =>
  api.get(`menu/vendor/branches/${branchId}/foods/`);
