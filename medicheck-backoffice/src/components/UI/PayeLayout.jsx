import React, { useRef, useState } from "react";
import { SideBar } from "./SideBar";
import { TopBar } from "./TopBar";
import { PageMainContent } from "./PageMainContent";
import { OtpModal } from "./OtpModal";

export const PageLayout = ({
  pageMainTitle,
  pageMainbuttonDescription,
  pageMainbuttonIcon,
  pageMainWelcome,
  pageTitle,
  children,
  onAdd,
  options,
  options2,
  handleSearch,
  filterValue,
  filterValue2,
  handleFilter,
  handleFilter2,
  ...props
}) => {
  const OtpModalRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenMenu() {
    setIsOpen(!isOpen);
  }

  function handleClose() {
    setIsOpen(false);
  }

  const handleCloseModal = ()=>{
    OtpModalRef.current.close();
  }

  return (
    <div
      className="h-screen w-screen flex overflow-y-scroll overflow-hidden xl:overflow-y-scroll"
      {...props}
    >
      {isOpen ? (
        <SideBar closeMenu={handleClose} />
      ) : (
        <SideBar style=" hidden lg:flex" />
      )}
      <div className=" h-full w-full flex-col ">
        <TopBar openMenu={handleOpenMenu} handleOpenOtpModal={()=> OtpModalRef.current.showModal()} />
        <OtpModal ref={OtpModalRef} onClose={handleCloseModal}/>
        <PageMainContent
          title={pageMainTitle}
          pageWelcome={pageMainWelcome}
          buttonDescription={pageMainbuttonDescription}
          buttonIcon={pageMainbuttonIcon}
          onAdd={onAdd}
          handleSearch={handleSearch}
          options={options}
          options2={options2}
          handleFilter={handleFilter}
          handleFilter2={handleFilter2}
          filterValue={filterValue}
          filterValue2={filterValue2}
        >
          {children}
        </PageMainContent>
      </div>
    </div>
  );
};
