import React from "react";
import { Route, Router, Routes } from "react-router-dom";
import { DashBoardPage } from "../components/Pages/DashboardPage/DashBoardPage";
import { InsurancePage } from "../components/Pages/InsurancePage/InsurancePage";
import { ProductsPage } from "../components/Pages/ProductsPage/ProductsPage";
import { EstablishmentPage } from "../components/Pages/EstablishmentPage/EstablishmentPage";
import { UsersPage } from "../components/Pages/UsersPage/UsersPage";
import { CoveragePage } from "../components/Pages/CoveragePage/CoveragePage";
import { PlansPage } from "../components/Pages/PlansPage/PlansPage";
import { IncidentsPage } from "../components/Pages/IncidentsPage/IncidentsPage";
import { PeoplePage } from "../components/Pages/PeoplePage/PeoplePage";

export const BackOfficeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashBoardPage />} />
      <Route path="insurance" element={<InsurancePage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="establishment" element={<EstablishmentPage />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="coverage" element={<CoveragePage />} />
      <Route path="plans" element={<PlansPage />} />
      <Route path="people" element={<PeoplePage />} />
      <Route path="incidents" element={<IncidentsPage />} />
    </Routes>
  );
};
