export const workerLoginAPI = async (login_id, pin_code) => {
  const res = await fetch("http://127.0.0.1:8000/api/worker/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login_id, pin_code }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Invalid credentials");
  }

  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
  localStorage.setItem("user-data", JSON.stringify(data.user));

  return data;
};
