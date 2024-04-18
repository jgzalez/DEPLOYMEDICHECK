import { Avatar } from "@mui/material";
import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { PaginationWidget } from "./PaginationWidget";

export const ConsultTable = () => {
  const dummydata = [
    {
      user: "Emilio Santos",
      insurer: "Mapfre salud",
      product: "Doloneuroalfa",
      coverage: 75,
    },
    {
      user: "Ismael Dicent",
      insurer: "ARS Reservas",
      product: "Profilaxia",
      coverage: 60,
    },
    {
      user: "Rusbel Duarte",
      insurer: "Senasa",
      product: "Consulta medica",
      coverage: 80,
    },
  ];
  return (
    <div className=" z-10 relative w-[90%] h-[350px]  mt-4 rounded-[11px] shadow-main-shadow overflow-auto md:col-span-2 md:w-[95%] md:h-[380px] bg-white lg:ml-2 lg:w-[89%]  lg:h-[380px] lg:col-span-2x xl:w-[95%] xl:col-span-4   xl:ml-0 2xl:h-[400px]">
      <h2 className=" text-[#898A8D] font-semibold  m-4 2xl:m-6 2xl:text-xl">
        Consultas
      </h2>
      <table
        className="w-[800px] md:w-[800px] lg:w-[1100px] xl:w-full
       overflow-x-scroll"
      >
        <thead className="border-y border-solid h-[55px] border-[#979797] 2xl:h-[55px] ">
          <tr>
            <th className="text-center">
              <h2 className="text-[#898A8D] font-semibold 2xl:text-lg">
                Usuario
              </h2>
            </th>
            <th className="text-left">
              <h2 className="text-[#898A8D] font-semibold 2xl:text-lg">
                Aseguradora
              </h2>
            </th>
            <th className="text-left">
              <h2 className="text-[#898A8D] font-semibold 2xl:text-lg">
                Producto
              </h2>
            </th>
            <th className="text-left">
              <h2 className="text-[#898A8D] font-semibold 2xl:text-lg">
                Cobertura
              </h2>
            </th>
            <th className="text-left">
              <h2 className="text-[#898A8D]  font-semibold 2xl:text-lg">
                Acciones
              </h2>
            </th>
          </tr>
        </thead>
        <tbody>
          {dummydata.map((consult) => {
            return (
              <tr
                key={consult.user}
                className=" border-y h-[55px] border-solid border-[#979797] 2xl:mt-1 2xl:h-[55px]"
              >
                <td>
                  <div className="flex items-center justify-evenly ">
                    <input
                      type="checkbox"
                      id="select"
                      name="select"
                      value={true}
                    />
                    <div className="flex items-center gap-2">
                      <Avatar className="!w-[30px] !h-[30px]" />{" "}
                      <p className="font-semibold">{consult.user}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p className="font-semibold">{consult.insurer}</p>
                </td>
                <td>
                  <p className="font-semibold">{consult.product}</p>
                </td>
                <td>
                  <div className="flex items-center gap-2 ">
                    <progress
                      value={consult.coverage}
                      max={100}
                      className="mt-2 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-bar]:h-[10px] [&::-webkit-progress-value]:rounded-lg    [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-[#0F3FCE] [&::-moz-progress-bar]:bg-violet-400"
                    />
                    <p className="font-semibold text-[#98989B] text-md">
                      {consult.coverage}%
                    </p>
                  </div>
                </td>
                <td>
                  <MoreVertIcon className="!text-[#D9D9D9] !text-4xl" />
                </td>
              </tr>
            );
          })}
        </tbody>
        <PaginationWidget />
      </table>
    </div>
  );
};
