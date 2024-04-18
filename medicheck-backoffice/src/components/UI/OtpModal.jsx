import React, { forwardRef, useRef, useState } from "react";
import { ModalInput } from "./ModalInput";
import { PinInput, PinInputField } from '@chakra-ui/react'
import { ChakraProvider } from "@chakra-ui/react";
import { resetPasswordOtp, sendOtpEmail, validateOtpCode } from "../../services/apiService";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import logo from '../../assets/LoginLogo.png'
import { Password } from "@mui/icons-material";

export const OtpModal = forwardRef(function OtpModal({onClose},ref
) {
  const modalRef = useRef();
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState({
    first:0,
    second:0,
    third:0,
    fourth:0,
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword]= useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")

  const handleEmail = (e)=> setEmail(e.target.value);

  const handleCode = (e)=> {
    const name = e.target.name;
    const value = e.target.value;
    setOtpCode((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  const handleNewPassword = (e) => setNewPassword(e.target.value);

  const handleConfirmPassword = (e)=> setConfirmPassword(e.target.value);

  const handleSendEmail = async()=>{
    try {
      if(email.length < 7){
        setErrorMessage("Email no válido, favor ingresar un email válido.")
      }
      else{
        setErrorMessage("")
        const response = await sendOtpEmail(email);
        console.log(response);
        response.status == 202 && setEmailSent(true);
       
      }
    } catch (error) {
      console.log(error);
    }
   
  }

  const handleVerifyCode = async()=>{
    try {
      setErrorMessage("")
      const token = `${otpCode.first}${otpCode.second}${otpCode.third}${otpCode.fourth}`
      const response = await validateOtpCode(email, token)
      response.status == 200 && setIsVerified(true);
    } catch (error) {
      setErrorMessage("Código de verificación incorrecto, favor ingresar un código válido")
      console.log(error)

    }
 
  }

  const handleResetPassword = async()=>{
    try {
      if(newPassword != confirmPassword){
        setErrorMessage("Las contraseñas deben coincidir, por favor intente de nuevo.")
      }
      else{
        const token = `${otpCode.first}${otpCode.second}${otpCode.third}${otpCode.fourth}`
        const response = await resetPasswordOtp(email, token,newPassword )
        console.log(response);
        response.status == 200 && setIsReset(true);
        onClose();
      }
  
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <ChakraProvider>
    <dialog className="w-[525px] h-fit rounded-md z-50 relative " ref={!ref?modalRef:ref}>
      
      <div className=" pt-10  flex justify-center items-center gap-4">
        <img className="w-[60px]" src={logo}/>
        <h1 className="font-bold text-lg">Reestablecimiento de contraseña</h1>
      </div>
      <button onClick={()=>onClose()} className="absolute top-6 right-6 font"><span className="font-bold bg- rounded-[50]">X</span></button>
      <form method="dialog" className="flex flex-col p-8 ">
      
        {!isVerified?(!emailSent?<div className="flex flex-col"><ModalInput placeholder="Ingresa email" required className="!h-10 w-full mt-2 p-2 border-2 border-[#232B43] rounded-md" label={"Ingresa tu email"} onChange={handleEmail}/>{errorMessage&&<span className="text-red-600 text-sm">{errorMessage}</span>}
        <button type="button" className="self-end" onClick={handleSendEmail}>Enviar</button></div>:<div className="h-full w-full text-center "><ArrowBackIosIcon onClick={()=> setEmailSent(false)} className="absolute top-10 left-5"/><p className="text-sm">Se envio el codigo de seguridad al email<b> {email}</b></p> 
            <PinInput  mask size='lg' type="number">
                <PinInputField className="mr-2 mt-5 mb-3 border shadow-main-shadow" onChange={handleCode} name="first" value={otpCode.first} />
                <PinInputField className="mr-2 shadow-main-shadow" onChange={handleCode} name="second" value={otpCode.second}/>
                <PinInputField className="mr-2 shadow-main-shadow" onChange={handleCode} name="third" value={otpCode.third}/>
                <PinInputField className="mr-2 shadow-main-shadow" onChange={handleCode} name= "fourth" value={otpCode.fourth}/>
            </PinInput>
            <div className="w-full flex"><button type="button" onClick={handleSendEmail}><span className="text-sm ml-4 text-[#551A8B] ">Reenviar código</span></button></div>
            
            <div className="w-full flex justify-end"><button type="button" className="bg-green-400 text-white rounded-md w-[90px] h-[30px] " onClick={handleVerifyCode}><span className="text-sm">Verify Code</span></button></div>
            {errorMessage && <span className="text-red-600 text-sm block mt-2">{errorMessage}</span>}
            </div>):
        <div className="flex flex-col gap-0">
          <ArrowBackIosIcon onClick={()=> {setIsVerified(false); setErrorMessage("");}} className="absolute top-10 left-5"/>
           <ModalInput type="password" className="!h-10 w-full  p-2 border-2 border-[#232B43] rounded-md" label={"New Password"} value={newPassword} onChange={handleNewPassword}/>
           <ModalInput type="password" className="!h-10 w-full  p-2 border-2 border-[#232B43] rounded-md" label={"Confirm Password"} value={confirmPassword} onChange={handleConfirmPassword}/>
           {errorMessage && <span className="text-red-600 text-sm block my-2">{errorMessage}</span>}
           <button type="button" className="bg-black p-1 self-end rounded-md h-[35px] w-[150px]  text-white" onClick={handleResetPassword}><span className="text-sm">Reset Password</span></button>
        </div>}
      </form>
    </dialog>
    </ChakraProvider>
  );
});
