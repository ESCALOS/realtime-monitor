// components/TemperatureChart.tsx
import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";

export interface TemperatureData {
  value: number;
  timestamp: string;
}

interface Props {
  data: TemperatureData[];
}

const TemperatureChart: React.FC<Props> = ({ data }) => {
  const series = [
    {
      name: "Temperatura (°C)",
      data: data.map((d) => [new Date(d.timestamp).getTime(), d.value]),
    },
  ];

  const options: ApexOptions = {
    chart: {
      id: "area-datetime",
      type: "area",
      height: 350,
      zoom: {
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: "zoom",
      },
    },
    annotations: {
      yaxis: [
        {
          y: 30,
          borderColor: "#999",
          label: {
            text: "Soporte",
            style: {
              color: "#fff",
              background: "#00E396",
            },
          },
        },
      ],
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: "datetime",
      tickAmount: 6,
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy HH:mm",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={350}
    />
  );
};

export default TemperatureChart;
