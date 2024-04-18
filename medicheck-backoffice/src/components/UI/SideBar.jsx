import React from "react";
import appLogo from "../../assets/applogo.png";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { SidebarItem } from "./SidebarItem";
import { ShoppingCartOutlined } from "@mui/icons-material";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import AddToQueueOutlinedIcon from "@mui/icons-material/AddToQueueOutlined";
import BallotOutlinedIcon from "@mui/icons-material/BallotOutlined";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import { useTranslation } from "react-i18next";

export const SideBar = ({ style, closeMenu }) => {
  const {t}= useTranslation();
  let sideBarClassname = `fixed w-[100vw] h-full z-30 flex lg:w-[274px]  ${style}`;
  return (
    <div className={sideBarClassname}>
      <div className="w-[60%] bg-[#1C222A]  h-full lg:sticky lg:left-0  lg:w-[274px] lg:flex-col">
        <div className="w-full h-[84px] flex justify-start pl-4 items-center bg-[#232B43] text-white gap-[5%]">
          <img src={appLogo} />
          <h1>MediCheck</h1>
        </div>
        <div className="flex flex-col pt-2 ">
          <SidebarItem title="Dashboard" path={"/"}>
            <DashboardOutlinedIcon className="!text-3xl" />
          </SidebarItem>
          <SidebarItem title={t('sidebar.insurances')} path={"/insurance"}>
            <VerifiedUserOutlinedIcon className="!text-3xl" />
          </SidebarItem>
          <SidebarItem title={t('sidebar.products')} path={"/products"}>
            <ShoppingCartOutlined className="!text-3xl" />
          </SidebarItem>
          <SidebarItem title={t('sidebar.establishments')} path={"/establishment"}>
            <LocalHospitalOutlinedIcon className="!text-3xl" />
          </SidebarItem>
          <SidebarItem title={t('sidebar.users')} path={"/users"}>
            <PermIdentityOutlinedIcon className="!text-3xl" />
          </SidebarItem>
          <SidebarItem title={t('sidebar.coverages')} path={"/coverage"}>
            <AddToQueueOutlinedIcon className="!text-3xl" />
          </SidebarItem>
          <SidebarItem title={t('sidebar.plans')} path={"/plans"}>
            <BallotOutlinedIcon className="!text-3xl" />
          </SidebarItem>
          <SidebarItem title={t('sidebar.people')} path={"/people"}>
            <EmojiPeopleIcon className="!text-3xl" />
          </SidebarItem>
          <SidebarItem title={t('sidebar.incidents')} path={"/incidents"}>
            <ReportOutlinedIcon className="!text-3xl" />
          </SidebarItem>
        </div>
      </div>
      <div
        className="w-[40%] h-full bg-overlay-background lg:hidden"
        onClick={() => closeMenu()}
      ></div>
    </div>
  );
};
