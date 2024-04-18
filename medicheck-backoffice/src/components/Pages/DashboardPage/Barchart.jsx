import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Barchart = () => {
  const data = [
    {
      name: "ARS Humano",
      value: 20,
    },
    {
      name: "Mapfre",
      value: 15,
    },
    {
      name: "ARS Reservas",
      value: 25,
    },
    {
      name: "Senasa",
      value: 30,
    },
    {
      name: "La monumental de seguros",
      value: 25,
    },
    {
      name: "ARS Futuro",
      value: 25,
    },
  ];
  return (
    <div className="w-[90%] z-0 h-[280px] mt-2 rounded-[11px] shadow-main-shadow bg-white  lg:w-[77%] lg:h-[220px] xl:col-span-2 xl:w-[90%] xl:h-[260px] 2xl:w-[91%] 2xl:h-[280px]">
      <ResponsiveContainer>
        <BarChart
          className="!z-[-2]"
          data={data}
          margin={{
            left: 0,
            right: 20,
            top: 20,
            bottom: 5,
          }}
          width={800}
          height="100%"
          title="Incidentes por aseguradoras"
        >
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#0033CC" barSize={20} radius={6} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
