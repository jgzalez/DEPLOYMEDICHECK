import React, { useContext, useState } from "react";
import Avatar from "@mui/material/Avatar";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import profileImg from "../../assets/profile.png";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";
import { useNavigate } from "react-router-dom";

import {LanguageSelector} from "./LanguageSelector";
import { useTranslation } from "react-i18next";
import LocaleContext from "../../LocaleContext";
import Swal from "sweetalert2"
export const TopBar = ({ openMenu,handleOpenOtpModal,title, ...props }) => {
  const {page} = useContext(LocaleContext);
  const user = JSON.parse(localStorage.getItem("user"))
  const [isOpen, setIsOpen] = useState(false);
  const {t}= useTranslation();
  const navigate = useNavigate();
  const handleLogout = () => {
    Swal.fire({
      title: "Estas seguro?",
      text: "Quieres cerrar sesión",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cerrar sesión"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    });
   
  };

 const handleOpenSettings=(e)=>{
   console.log(e);
   setIsOpen(!isOpen)
 }

  return (
    <div
      className=" bg-white z-10 fixed top-0 text-black flex justify-evenly items-center gap-[5%] w-full h-[60px] py-6 pl-3 md:h-[80px] lg:w-[90%] lg:ml-[180px] xl:ml-[150px] xl:w-full xl: xl:justify-around"
      {...props}
    >
      <div
        onClick={() => openMenu()}
        className="flex flex-col justify-between w-[2.25rem] h-[1.7rem] lg:hidden md:justify-self-start"
      >
        <span className="h-[0.3rem] w-[full] bg-[#ADADAD] rounded-[3px]"></span>
        <span className="h-[0.3rem] w-[full] bg-[#ADADAD] rounded-[3px]"></span>
        <span className="h-[0.3rem] w-[full] bg-[#ADADAD] rounded-[3px]"></span>
      </div>
      <div className="relative">
        {/* <input
          placeholder={t('topbar.searchBar')}
          className=" w-[164px] h-[30px] p-2 bg-[#392DBF08] rounded-md md:w-[300px] md:h-[45px]"
        />
        <SearchIcon className="!absolute left-[137px] top-1 md:left-[260px] md:top-3" /> */}
        <h1 className="font-semibold text-lg">{page}</h1>
      </div>

      <div className="flex gap-4">
      
        <div>
          <div
            onClick={handleOpenSettings}
            className="flex h-[30px] !text-black gap-2 bg-[#392DBF08] items-center  rounded-md p-1 md:h-[45px] md:w-[120px] md:p-2"
          >
            <Avatar
              src={profileImg}
              alt="Image of the app"
              className="!w-5 !h-5 md:!w-7 md:!h-7"
            />
            <p className="text-sm">{user?.nombre}</p>
            <KeyboardArrowDownIcon className="!w-5 !h-5" />
          </div>
          {isOpen && (
            <div className="absolute w-[220px] bg-white z-10000 rounded-sm shadow-main-shadow">
              <div className="bg-[#f6f7f9] p-4 flex flex-col items-center ">
                <Avatar className="!w-7 !h-7 md:!w-9 md:!h-9" />
                <p className="font-bold mt-2">{user?.nombre} {user?.apellidos}</p>
                <p className="text-[#898A8D]">{user?.rol}</p>
              </div>
              <hr />
              <div className="">
                <div className="w-full h-[50%] hover:bg-[#f6f7ff]">
                  <div className="px-4 py-3"><LanguageSelector/></div>
                  
                </div>

                <div className="w-full h-[50%] hover:bg-[#f6f7ff]">
                  <p onClick={handleOpenOtpModal} className="px-4 py-3">Cambiar contraseña</p>
                </div>
                <div
                  onClick={handleLogout}
                  className="w-full h-[50%] hover:bg-[#f6f7ff]"
                >
                  <p className="px-4 py-2 ">Cerrar Sesión</p>
                </div>  
              </div>
            </div>
          )}
        </div>
        <div className="hidden lg:flex bg-[#392DBF08] w-[54px] h-[36px] justify-center gap-2 items-center md:h-[45px]  rounded-md">
          <NotificationsIcon />
          <CircleIcon className="!w-[6px] !h-[6px]" />
        </div>
        {/* <div className="hidden bg-[#392DBF08] lg:flex items-center justify-center h-[36px] md:h-[45px] rounded-md p-2">
          <FormatListBulletedIcon className="rotate-180" />
        </div> */}
      </div>
    </div>
  );
};
