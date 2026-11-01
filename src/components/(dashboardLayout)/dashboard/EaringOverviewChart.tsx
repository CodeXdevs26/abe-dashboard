"use client";
import { Select } from "antd";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetEarningOverviewQuery } from "@/redux/api/summaryApi";
import Spinner from "@/components/spinner/spinner";

const EaringOverviewChart = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString(),
  );
  const { data: earningData, isLoading } = useGetEarningOverviewQuery({
    year: parseInt(selectedYear),
  });

  if (isLoading) {
    return (
      <div className="bg-primary-green rounded-lg p-8 xl:w-1/2 min-h-[500px] flex items-center justify-center">
        <Spinner size={120} white />
      </div>
    );
  }

  const earningOverview = earningData?.data || [];

  const janData = earningOverview.find(
    (item: { month: string; earnings: number }) => item.month === "jan",
  );
  const decData = earningOverview.find(
    (item: { month: string; earnings: number }) => item.month === "dec",
  );
  const growth =
    janData && decData && janData.earnings > 0
      ? (
          ((decData.earnings - janData.earnings) / janData.earnings) *
          100
        ).toFixed(2)
      : "0.00";

  const handleChange = (value: string) => {
    setSelectedYear(value);
  };

  return (
    <div className="bg-primary-green rounded-lg p-8 xl:w-1/2 min-h-[500px]">
      <>
        <div className="text-parimaryWhite flex justify-between items-center mb-10">
          <h1 className="text-xl">Earning Overview</h1>
          <div className="flex items-center gap-5">
            <h1 className="">
              Monthly Growth:{" "}
              <span className="ml-2 font-medium">{growth}%</span>
            </h1>
            <Select
              value={selectedYear}
              style={{ width: 120 }}
              onChange={handleChange}
              options={[
                { value: "2024", label: "2024" },
                { value: "2025", label: "2025" },
                { value: "2026", label: "2026" },
                { value: "2027", label: "2027" },
              ]}
            />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={earningOverview.map(
              (item: { month: string; earnings: number }) => ({
                month: item.month.charAt(0).toUpperCase() + item.month.slice(1),
                earning: item.earnings,
              }),
            )}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
            barSize={20}
          >
            <XAxis
              dataKey="month"
              scale="point"
              padding={{ left: 10, right: 10 }}
              tickMargin={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis axisLine={false} tickLine={false} tickMargin={20} />
            <Tooltip
              formatter={(value) => [`Earning: $${value}`]}
              itemStyle={{ color: "#000" }}
            />
            <CartesianGrid
              opacity={0.2}
              horizontal={true}
              vertical={false}
              stroke="080E0E"
              strokeDasharray="0"
            />
            <Bar
              barSize={12}
              radius={10}
              background={false}
              dataKey="earning"
              fill="#1D242D"
              stroke="#080E0E"
            />
          </BarChart>
        </ResponsiveContainer>
      </>
    </div>
  );
};

export default EaringOverviewChart;
