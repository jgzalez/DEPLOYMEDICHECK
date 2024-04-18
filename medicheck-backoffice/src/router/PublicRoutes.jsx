import React from "react";
import { Navigate } from "react-router-dom";

export const PublicRoutes = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return token && user ? <Navigate to={"/dashboard"} /> : children;
};
