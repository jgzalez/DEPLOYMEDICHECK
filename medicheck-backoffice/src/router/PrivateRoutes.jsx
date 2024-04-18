import React from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoutes = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return token && user ? children : <Navigate to={"/login"} />;
};
