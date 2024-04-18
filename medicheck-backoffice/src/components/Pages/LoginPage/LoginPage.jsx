import React, { useContext, useEffect, useRef, useState } from "react";
import Logo from "../../../assets/LoginLogo.png";
import medicalImg from "../../../assets/loginPortrait.png";
import { useNavigate } from "react-router-dom";
import { getDashboardStatistics, getUserByid, getUsers, login } from "../../../services/apiService";
import { useTranslation } from "react-i18next";
import LocaleContext from "../../../LocaleContext";
import { OtpModal } from "../../UI/OtpModal";

export const LoginPage = () => {
  const navigate = useNavigate();
  const otpModalRef = useRef();
  const {setCurrentUser} = useContext(LocaleContext)
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated]=useState(true);
  const {t} = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const credentials = {
        noDocumento: id,
        tipoDocumento: "CEDULA", // Replace with actual value or form input
        clave: password,
      };

      const response = await login(credentials); // Make the API call
      console.log("API response:", response); // Log the full response

      if (!response || !response.accessToken) {
        throw new Error("Invalid response from server: missing accessToken");
      }
      setIsAuthenticated(true)
     
      const token = response.accessToken; // Asegúrate de que esto coincida con la estructura de tu respuesta
      localStorage.setItem("token", token);
      const {totalUsuarios} = await getDashboardStatistics();
      const users = await getUsers(1, totalUsuarios,"","","");
      const currentUser = users.data.find(user=> user.noDocumento == credentials.noDocumento)
      const usuario = await getUserByid(currentUser.idUsuario);
      console.log(usuario);
      localStorage.setItem("user", JSON.stringify(usuario));
      setCurrentUser(usuario)
      console.log(token); // Handle the response (e.g., storing auth token)
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
      // Handle login error (e.g., showing an error message)
    }

    // Handle login error (e.g., showing an error message)
  };
  const handleCloseModal = ()=>{
    otpModalRef.current.close();
  }
  return (
    <div className="mt-[10%] w-[100vw] xl:flex xl:mt-0 overflow-hidden">
      <OtpModal ref={otpModalRef} onClose={handleCloseModal}/>
      <div className="xl:w-[50%] xl:bg-[#F1F5F9] xl:h-[100vh]">
        <div className="flex justify-center items-center gap-1 xl:mt-10 xl:w-[70%] xl:mx-auto xl:my-0 xl:justify-start xl:gap-5 xl:pt-12">
          <img src={Logo} className="w-[60px] xl:w-[129.67px] xl:h-[113px]" />
          <h2 className="font-bold xl:text-[32px] xl:font-bold">Medicheck</h2>
        </div>
        <img
          src={medicalImg}
          className="hidden xl:block ml-[3%] object-scale-down"
        />
      </div>
      <div className="mt-[10%] xl:w-[50%]">
        <div className="text-center">
          <h1 className="text-2xl font-semibold p-4">{t('loginPage.signIn')}</h1>
          <p className="p-3 font-medium">
            {t('loginPage.signInDescripcion')}
          </p>
        </div>

        <form
          className="w-[80%] mx-auto my-0 xl:w-[50%]"
          onSubmit={handleSubmit}
        >
          <label className="block">
            ID
            <input
              type="text"
              value={id}
              required
              onChange={(e) => setId(e.target.value)}
              className="w-[100%] h-[45px] rounded-[7px] p-4 border border-solid border-[#D9D9D9] mb-[5%] mt-[2%]"
            />
          </label>
          <label className="block">
            {t('loginPage.password')}
            <input
              type="password" // Changed to 'password' type
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-[100%] h-[45px] rounded-[7px] p-4 border border-solid border-[#D9D9D9] mb-[3%] mt-[2%]"
            />
          </label>
          <label className="text-sm">
            <input
              type="checkbox"
              className="rounded-[3px] bg-grey-hover mr-1"
              
            />
           {t('loginPage.keepMeSign')}
          </label>
          <span className="pl-10 text-sm font-semibold" onClick={()=> otpModalRef.current.showModal()}>{t('loginPage.forgotPassword')}</span>
          {!isAuthenticated && <span className=" text-sm text-red-800 text-center" >{t('loginPage.loginFailedMsg')}</span>}
          <button
            type="submit" // Changed to 'submit' type
            className="w-full h-[45px] bg-black rounded-[7px] text-white mt-4"
          >
            Sign in
          </button>
        </form>
        <p className="text-center text-[#A1A8B0] font-semibold text-[12px] mt-16">
          Copyright 2023, Medicheck All Rights Reserved.
        </p>
      </div>
    </div>
  );
};
