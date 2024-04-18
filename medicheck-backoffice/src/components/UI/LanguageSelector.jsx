import { useContext } from "react";
import i18n from "../../helpers/i18n";
import LocaleContext from "../../LocaleContext";
import { useTranslation } from "react-i18next";
import spainFlag from '../../assets/Spainflag.png'
import statesFlag from '../../assets/united-states.png'

export const LanguageSelector =()=>{
    const {t}= useTranslation();
    const handleChangeLanguage = (e)=>{
        i18n.changeLanguage(e.target.value);
    }
    const {locale, setLocale} = useContext(LocaleContext);
    console.log(locale);
    return(
        <div className="flex items-center">
          <label>{locale == "en"?<img className="w-[20px]" src={statesFlag}/>:<img className="w-[20px]" src={spainFlag}/>}</label>
          <select value={locale} onChange={handleChangeLanguage}>
            <option value={"en"}>{t('languages.english')}</option>
            <option value={"es"}>{t('languages.spanish')}</option>
          </select>
        </div>
    );
}
