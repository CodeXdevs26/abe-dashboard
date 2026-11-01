"use client";
import { Select } from "antd";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { useGetUserOverviewQuery } from "@/redux/api/summaryApi";
import Spinner from "@/components/spinner/spinner";

const ProductSellChart = () => {
  const year = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(year);
  const { data: userOverviewData, isLoading } = useGetUserOverviewQuery({
    year: selectedYear,
  });

  const userOverview = (userOverviewData?.data || []).map(
    (item: { month: string; users: number }) => ({
      month: item.month.charAt(0).toUpperCase() + item.month.slice(1),
      users: item.users,
    }),
  );

  const handleChange = (value: number) => {
    setSelectedYear(value);
  };

   if (isLoading) {
    return (
      <div className="bg-primary-green rounded-lg p-8 xl:w-1/2 min-h-[500px] flex items-center justify-center">
        <Spinner size={120} white />
      </div>
    );
  }

  return (
    <div className="bg-primary-green rounded-lg p-8 w-full xl:w-1/2">
      <>
        <div className="text-parimaryWhite flex lg:flex-wrap xl:flex-nowrap justify-between items-center mb-10 gap-5">
          <h1 className="text-xl">User Overview</h1>
          <div className="flex items-center gap-5">
            <Select
              value={selectedYear}
              style={{ width: 120 }}
              onChange={handleChange}
              options={[
                { value: 2024, label: "2024" },
                { value: 2025, label: "2025" },
                { value: 2026, label: "2026" },
                { value: 2027, label: "2027" },
                { value: 2028, label: "2028" },
                { value: 2029, label: "2029" },
                { value: 2030, label: "2030" },
                { value: 2031, label: "2031" },
                { value: 2032, label: "2032" },
              ]}
            />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={userOverview}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                <stop offset="30%" stopColor="#080E0E" stopOpacity={1} />
                <stop offset="100%" stopColor="#22804C" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <XAxis
              tickMargin={10}
              axisLine={false}
              tickLine={false}
              dataKey="month"
            />
            <YAxis tickMargin={20} axisLine={false} tickLine={false} />
            <Tooltip formatter={(value) => [`Users: ${value}`]} />
            <Area
              activeDot={false}
              type="monotone"
              dataKey="users"
              strokeWidth={0}
              stroke="#080E0E"
              fill="url(#color)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </>
    </div>
  );
};

export default ProductSellChart;
