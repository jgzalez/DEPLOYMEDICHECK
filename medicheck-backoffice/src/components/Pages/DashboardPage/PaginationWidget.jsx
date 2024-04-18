import React from "react";

export const PaginationWidget = () => {
  return (
    <div className="w-[800px] h-[45px]  items-center absolute bottom-4 flex justify-between lg:w-[1100px] xl:w-full ">
      <p className="ml-4 text-[#909194] font-semibold">
        Mostrando 1 a 5 de 25 entradas
      </p>
      <div className="flex gap-2 mr-6">
        <button className="bg-pagination-button rounded-[11px] p-2 2xl:h-[50px] 2xl:w-[100px] ">
          Anterior
        </button>
        <button className="bg-[#1E4BD2] w-[30px] rounded-[11px] text-white 2xl:w-[40px]">
          1
        </button>
        <button className="bg-pagination-button w-[30px]  rounded-[11px] 2xl:w-[40px]">
          2
        </button>
        <button className="bg-pagination-button w-[30px]  rounded-[11px] 2xl:w-[40px]">
          3
        </button>
        <button className="bg-pagination-button rounded-[11px] p-2 2xl:h-[50px] 2xl:w-[100px] ">
          Siguiente
        </button>
      </div>
    </div>
  );
};
