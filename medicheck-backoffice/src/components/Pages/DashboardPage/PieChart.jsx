import React from "react";
import Chart from "react-google-charts";

export const PieChart = () => {
  const data = [
    ["Aseguradoras", "Incidentes"],
    ["ARS Humano", 11],
    ["Senasa", 9],
    ["Mapfre", 5],
    ["ARS Reservas", 2],
    ["ARS Futuro", 7],
    ["La Monumental de seguros", 8], // CSS-style declaration
  ];
  const options = {
    title: "Incidentes por aseguradoras",
    pieHole: 0.4,
    is3D: false,
  };

  return (
    <div
      className="w-[90%] h-[280px] rounded-[11px] shadow-main-shadow bg-white mt-2  lg:w-[77%] lg:h-[220px] xl:w-[90%] xl:h-[260px]
       xl:col-span-2 2xl:w-[91%] 2xl:h-[280px]"
    >
      {" "}
      <Chart
        chartType="PieChart"
        width="100%"
        height="100%"
        data={data}
        options={options}
      />
    </div>
  );
};
