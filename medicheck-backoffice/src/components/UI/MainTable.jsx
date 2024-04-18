import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PaginationComponent } from "./PaginationComponent";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

export const MainTable = ({
  headers,
  mainData,
  onDelete,
  onEdit,
  totalRows,
  handleChangeRowsPerPage,
  handlePageChange,
  rowsPerPage,
  page,
}) => {
  const { t } = useTranslation();
  return (
    <div className="overflow-auto w-full h-fit py-2 lg:overflow-scroll lg:w-screen lg:ml-4 xl:overflow-scroll xl:ml-0 xl:w-full 2xl:overflow-x 2xl:ml-0 shadow-main-shadow">
      <table className="w-[300%] h-[90%] rounded-md mt-2 ml-3 md:w-[150%] lg:w-[80%] md:ml-8 xl:w-[95%] 2xl:ml-0  2xl:w-[105%] ">
        <thead>
          <tr className="bg-table-row-grey h-14 ">
            {headers.map((header) => (
              <th className="text-left pl-5 " key={header}>
                <h1 className="xl:text-sm">{header}</h1>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(!mainData || mainData.length === 0) && (
            <tr>
              <td>
                <p className="p-4">
                  Todavia no existen registros de esta entidad
                </p>
              </td>
            </tr>
          )}
          {mainData &&
            mainData.map((data) => (
              <tr
                className="h-14 even:bg-table-row-grey odd:bg-white"
                key={data.id}
              >
                {Object.keys(data)
                  .filter((key) => key !== "id")
                  .map((obj) => (
                    <td className="pl-5" key={obj}>
                      <p className="xl:text-xs ">{data[obj]}</p>
                    </td>
                  ))}
                <td className="pl-5" key={data.id}>
                  <div>
                    <button
                      onClick={() => onEdit(data)}
                      className="text-[#0033CC]  border-[1px] border-solid border-[#0033CC] py-1 px-2 rounded-md mr-2"
                    >
                      <ModeEditOutlineOutlinedIcon className="!text-xl" />
                      {/* {t('modalButton.edit')} */}
                    </button>{" "}
                    <button
                      onClick={() => onDelete(data.id)}
                      className="text-[#FF1001] border-[1px] border-solid border-[#FF1001] py-1 px-2 rounded-md"
                    >
                      <DeleteForeverOutlinedIcon className="!text-xl" />
                      {/* {t('modalButton.delete')} */}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <PaginationComponent
        total={totalRows}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handlePageChange={handlePageChange}
        page={page}
        rowsPerPage={rowsPerPage}
      />
    </div>
  );
};
