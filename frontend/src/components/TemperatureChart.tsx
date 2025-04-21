// components/TemperatureChart.tsx
import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { TemperatureData } from "../types";

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
      zoom: {
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: "zoom",
      },
      defaultLocale: "es",
      locales: [
        {
          name: "es",
          options: {
            months: [
              "Enero",
              "Febrero",
              "Marzo",
              "Abril",
              "Mayo",
              "Junio",
              "Julio",
              "Agosto",
              "Septiembre",
              "Octubre",
              "Noviembre",
              "Diciembre",
            ],
            shortMonths: [
              "Ene",
              "Feb",
              "Mar",
              "Abr",
              "May",
              "Jun",
              "Jul",
              "Ago",
              "Sep",
              "Oct",
              "Nov",
              "Dic",
            ],
            days: [
              "Domingo",
              "Lunes",
              "Martes",
              "Miércoles",
              "Jueves",
              "Viernes",
              "Sábado",
            ],
            shortDays: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
            toolbar: {
              download: "Descargar SVG",
              selection: "Selección",
              selectionZoom: "Zoom de selección",
              zoomIn: "Acercar",
              zoomOut: "Alejar",
              pan: "Desplazar",
              reset: "Restablecer zoom",
            },
          },
        },
      ],
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
      labels: {
        datetimeUTC: true,
        style: {
          fontSize: "24px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "24px",
        },
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy HH:mm:ss",
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
    grid: {
      show: true,
      borderColor: "#90A4AE",
      strokeDashArray: 0,
      position: "back",
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={550}
    />
  );
};

export default TemperatureChart;
