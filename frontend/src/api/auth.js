export const loginAPI = async (email, password) => {
  const response = await fetch("http://127.0.0.1:8000/api/accounts/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  console.log("LOGIN: ", data)

  if (!response.ok) {
    // pass backend error message to UI
    throw new Error(data.message || "Login failed");
  }

  return data;
};
