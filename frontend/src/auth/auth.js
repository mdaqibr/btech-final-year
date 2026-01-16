// src/auth/auth.js

export const getAuthUser = () => {
  const access = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user-data") || "{}");

  return {
    isAuthenticated: Boolean(access),
    user,
    access,
  };
};
