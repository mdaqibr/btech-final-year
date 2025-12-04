const BASE_URL = "http://127.0.0.1:8000/api/accounts/employee/register";
const BASE_URL_2 = "http://127.0.0.1:8000/api/accounts";

export const createEmployeeUser = async (email) => {
  const res = await fetch(`${BASE_URL}/create-user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

export const setEmployeePassword = async (email, password) => {
  const res = await fetch(`${BASE_URL}/set-password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },  
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const sendOTP = async (email) => {
  const res = await fetch(`${BASE_URL}/send-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

export const verifyOTP = async (email, otp) => {
  const res = await fetch(`${BASE_URL}/verify-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return res.json();
};

export const getCompanies = async () => {
  const res = await fetch(`${BASE_URL_2}/companies/`);
  return res.json();
};

export const getBranches = async (companyId) =>
  (await fetch(`${BASE_URL_2}/companies/${companyId}/branches/`)).json();

export const getBuildings = async (branchId) =>
  (await fetch(`${BASE_URL_2}/branches/${branchId}/buildings/`)).json();

export const updateEmployee = async (data) => {
  const res = await fetch(`${BASE_URL}/update-employee/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};