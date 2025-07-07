// src/Components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const userRole = localStorage.getItem("userRole");

  // Jika belum login
  if (!userRole) {
    return <Navigate to="/login" />;
  }

  // Jika role tidak sesuai
  if (role && userRole !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
