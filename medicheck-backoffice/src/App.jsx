import { Suspense, useState } from "react";

import { BrowserRouter as Router} from "react-router-dom";
import { AppRouter } from "./router/AppRouter";
import i18n from "./helpers/i18n";
import LocaleContext from "./LocaleContext";


function Loading(){
  return(
    <>Loading...</>
  )
}

function App() {
  const [locale, setLocale] = useState(i18n.language);
  const [page, setCurrentPage] = useState("Aseguradoras");
  const [user, setCurrentUser] = useState(null);
  i18n.on('languageChanged', (lng)=> setLocale(i18n.language))

  return (
    <>
    {/* <ChakraProvider> */}
     <LocaleContext.Provider value={{locale, setLocale, page, setCurrentPage, user, setCurrentUser}}>
      <Suspense fallback={<Loading/>}>
      <Router>
        <AppRouter />
      </Router>
      </Suspense>
      </LocaleContext.Provider>
      {/* </ChakraProvider> */}
    </>
  );
}

export default App;
