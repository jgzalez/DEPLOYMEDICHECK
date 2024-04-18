import { createContext } from "react";

const defaultValue={
    locale: 'es',
    setLocale:()=>{},
    page:"",
    setCurrentPage:()=>{},
    user:null,
    setCurrentUser: ()=>{}
}

export default createContext(defaultValue);