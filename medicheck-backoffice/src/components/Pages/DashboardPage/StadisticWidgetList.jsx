import React, { useEffect, useState } from "react";
import { StadisticWidget } from "./StadisticWidget";
import contactImg from "../../../assets/maleUser.png";
import hospitalImg from "../../../assets/Clinic.png";
import incidentImg from "../../../assets/Error.png";
import insuranceImg from "../../../assets/Protect.png";
import {
  getDashboardStatistics,
  getEstablishment,
  getIncidents,
  getInsurances,
  getUsers,
} from "../../../services/apiService";
import { useTranslation } from "react-i18next";
export const StadisticWidgetList = () => {
  const {t}= useTranslation();
  const [stadistics, setStadistics] = useState({
    users: 0,
    establishments: 0,
    incidents: 0,
    insurances: 0,
  });
  
  useEffect(() => {
    (async () => {
      
      const stadisticsObject = await getDashboardStatistics();

      setStadistics({
        ...stadisticsObject,
      });
    })();
  }, []);

  return (
    <>
      <StadisticWidget
        total={stadistics.totalUsuarios}
        totalDescription={t('dashboardPage.totalUserStatistics')}
        widgetDescription={t('dashboardPage.seeUsers')}
        icon={contactImg}
      />
      <StadisticWidget
        total={stadistics.totalIncidentes}
        totalDescription={t('dashboardPage.totalIncidentStatistics')}
        widgetDescription={t('dashboardPage.seeIncidents')}
        icon={incidentImg}
      />
      <StadisticWidget
        total={stadistics.totalAseguradoras}
        totalDescription={t('dashboardPage.totalInsuranceStatistics')}
        widgetDescription={t('dashboardPage.seeInsurances')}
        icon={insuranceImg}
      />
      <StadisticWidget
        total={stadistics.totalPlanes}
        totalDescription={t('dashboardPage.totalPlanStatistics')}
        widgetDescription={t('dashboardPage.seePlans')}
        icon={insuranceImg}
      />
      <StadisticWidget
        total={stadistics.totalFarmacias}
        totalDescription={t('dashboardPage.totalPharmacyStatistics')}
        widgetDescription={t('dashboardPage.seePharmacies')}
        icon={insuranceImg}
      />
       <StadisticWidget
        total={stadistics.totalLaboratorios}
        totalDescription={t('dashboardPage.totalLabStatistics')}
        widgetDescription={t('dashboardPage.seeLabs')}
        icon={insuranceImg}
      />
        <StadisticWidget
        total={stadistics.totalCentrosMedicos}
        totalDescription={t('dashboardPage.totalMedicalFacilityStatistics')}
        widgetDescription={t('dashboardPage.seeMedicalFacilities')}
        icon={insuranceImg}
      />
        <StadisticWidget
        total={stadistics.totalProductos}
        totalDescription={t('dashboardPage.totalProductStatistics')}
        widgetDescription={t('dashboardPage.seeProducts')}
        icon={insuranceImg}
      />
    </>
  );
};
