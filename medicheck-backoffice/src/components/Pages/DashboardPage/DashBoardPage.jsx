import React, { useContext, useEffect, useState } from "react";
import { StadisticWidget } from "./StadisticWidget";
import { Barchart } from "./Barchart";
import { PieChart } from "./PieChart";
import { StadisticWidgetList } from "./StadisticWidgetList";
import { PageLayout } from "../../UI/PayeLayout";
import insuranceImg from "../../../assets/Protect.png";
import { useTranslation } from "react-i18next";
import LocaleContext from "../../../LocaleContext";

export const DashBoardPage = () => {
  const {setCurrentPage} = useContext(LocaleContext)
  const {t} = useTranslation();
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(()=>{
    setCurrentPage("");
  },[])
  console.log(user);
  return (
    <PageLayout
      pageMainTitle={"Dashboard"}
      pageMainWelcome={`${t('dashboardPage.welcome')}${user.nombre}${t('dashboardPage.welcome2')}`}
    >
      <div className="grid grid-cols-1 justify-items-center z-0  md:grid-cols-2  xl:grid-cols-4 lg:w-[93%] lg:mx-auto lg:my-0">
        <StadisticWidgetList/>
      
        <Barchart />
        <PieChart />
        {/* <ConsultTable /> */}
     
    
      </div>
    </PageLayout>
  );
};
