import React from "react";
import ChecklistIcon from "@mui/icons-material/Checklist";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";

export const PageMainContent = ({
  children,
  title,
  options,
  options2,
  buttonDescription,
  buttonIcon,
  pageWelcome,
  handleSearch,
  filterValue,
  filterValue2,
  handleFilter,
  handleFilter2,
  onAdd,
  ...props
}) => {
  const {t} = useTranslation();
  return (
    <div
      className="w-full h-screen  bg-[#F3F2FB] py-5 overflow-y-scroll overflow-x-hidden  mt-[60px] sm:h-full md:mt-[80px] lg:ml-[275px] lg:w-[77vw]   xl:w-[83vw]  xl:ml-[250px] 2xl:w-[86vw] 2xl:ml-[275px]"
      {...props}
    >
      {buttonIcon ? (
        <div className="flex flex-col justify-center  md:flex-row md:items-center md:justify-around">
          {/* <h1 className="text-black mb-4 pl-3 font-semibold text-lg md:text-2xl md:pl-8 md:mb-0">
            {title}
          </h1> */}
         {options && <select value={filterValue} onChange={handleFilter} className="ml-14 md:w-[150px]">
            {options.map((option)=>{
              return <option key={option} value={option}>{option}</option>
            })}
          </select>}

          {options2 && <select value={filterValue2} onChange={handleFilter2} className="ml-14 md:w-[150px]">
            {options2.map((option)=>{
              return <option key={option} value={option}>{option}</option>
            })}
          </select>}
          

          <div className="flex items-center pl-3 ml-10  gap-3 md:mr-16 mb-4 ">
            <button
              onClick={onAdd}
              className="bg-[#0A41E9] text-xs w-[200px] rounded-md p-1 text-white md:px-3 shadow-main-shadow h-[2.5rem] md:w-fit "
            >
              {buttonIcon} {buttonDescription}
            </button>
            <div className="bg-[#0A41E9] h-[2.5rem] hidden md:w-fit rounded-md px-3 md:flex items-center ">
              <ChecklistIcon className="!text-white" />
            </div>
            <div className="relative">
              <input
                placeholder={t('topbar.searchBar')}
                className="h-[2.5rem] rounded-md px-3"
                onChange={handleSearch}
              />
              <SearchIcon className="text-[lightgray] !absolute z-1 right-3 top-3" />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-left">
          <h1 className="text-black text-xl pl-6 font-semibold lg:pl-20 xl:pl-16 2xl:pl-24">
            {title}
          </h1>
          <p className="text-[#898A8D] font-semibold text-sm pl-6 pt-2 lg:pl-20 xl:pl-16 2xl:pl-24">
            {pageWelcome}
          </p>
        </div>
      )}

      {children}
    </div>
  );
};
