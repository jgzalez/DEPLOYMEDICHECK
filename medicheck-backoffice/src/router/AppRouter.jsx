import React from "react";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../components/Pages/LoginPage/LoginPage";
import { BackOfficeRoutes } from "./BackOfficeRoutes";
import { PrivateRoutes } from "./PrivateRoutes";
import { PublicRoutes } from "./PublicRoutes";
import { Login } from "@mui/icons-material";

export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route
          path="login"
          element={
            <PublicRoutes>
              <LoginPage />
            </PublicRoutes>
          }
        />
        <Route
          path="/*"
          element={
            <PrivateRoutes>
              <BackOfficeRoutes />
            </PrivateRoutes>
          }
        />
      </Routes>
    </>
  );
};
