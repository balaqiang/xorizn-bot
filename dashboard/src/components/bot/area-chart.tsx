"use client";
/** Grafik area (ApexCharts) gaya TailAdmin "Users & Revenue Statistics". */
import { useTheme } from "@/context/theme-context";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AreaChart({
  categories,
  series,
  height = 310,
  colors = ["#465FFF", "#0BA5EC"],
}: {
  categories: string[];
  series: { name: string; data: number[] }[];
  height?: number;
  colors?: string[];
}) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const options: ApexOptions = {
    chart: { type: "area", fontFamily: "Outfit, sans-serif", toolbar: { show: false }, zoom: { enabled: false }, background: "transparent" },
    colors,
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.45, opacityTo: 0.05 } },
    markers: { size: 0, hover: { size: 5 } },
    grid: { borderColor: dark ? "#1D2939" : "#F2F4F7", xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
    tooltip: { theme: dark ? "dark" : "light", x: { show: true } },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: dark ? "#98A2B3" : "#667085", fontSize: "12px" } },
    },
    yaxis: { labels: { style: { colors: dark ? "#98A2B3" : "#667085", fontSize: "12px" }, formatter: (v) => String(Math.round(v)) } },
    theme: { mode: dark ? "dark" : "light" },
  };
  return (
    <div className="-ms-4 -me-2 min-h-[260px]">
      <ReactApexChart options={options} series={series} type="area" height={height} />
    </div>
  );
}
