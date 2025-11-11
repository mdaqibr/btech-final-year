export const loginAPI = async (email, password) => {
  const response = await fetch("http://127.0.0.1:8000/api/accounts/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  return await response.json();
};