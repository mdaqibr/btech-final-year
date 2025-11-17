const BASE_URL = "http://127.0.0.1:8000/api/accounts";

export const createUser = async (email) => {
  console.log("email; ", email)
  const res = await fetch(`${BASE_URL}/company/register/create-user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  
  const data = await res.json();
  console.log("response data: ", data);

  return data;
};

export const setPassword = async (email, password) => {
  const res = await fetch(`${BASE_URL}/company/register/set-password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  console.log("response data: ", data);

  return data;
};

export const sendOTP = async (email) => {
  const res = await fetch(`${BASE_URL}/company/register/send-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

export const verifyOTP = async (email, otp) => {
  const res = await fetch(`${BASE_URL}/company/register/verify-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return res.json();
};

export const updateCompany = async (formData) => {
  const res = await fetch(`${BASE_URL}/company/register/update-company/`, {
    method: "POST",
    body: formData,
  });
  return res.json();
};

export const addBranches = async (branches) => {
  const res = await fetch(`${BASE_URL}/company/register/add-branches/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(branches),
  });
  return res.json();
};
