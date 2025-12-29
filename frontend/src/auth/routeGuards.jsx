// src/auth/routeGuards.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { getAuthUser } from "./auth";

export const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user } = getAuthUser();

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Logged in but wrong role
  if (allowedRoles && !allowedRoles.includes(user?.user_type)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
