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
