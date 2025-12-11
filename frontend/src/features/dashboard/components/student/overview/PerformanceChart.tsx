// src/features/dashboard/components/student/PerformanceChart.tsx
"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PerformanceDataPoint } from "@/features/dashboard/types/student";

interface PerformanceChartProps {
  data: PerformanceDataPoint[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  return (
    <div className="w-full h-full min-h-[300px] select-none">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
          barGap={8} // Gap between the two bars on the same day
        >
          {/* Background Grid Lines */}
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#e5e7eb" 
          />

          {/* X Axis: Display dates (e.g., 24/11, 25/11...) */}
          <XAxis 
            dataKey="date" // <--- IMPORTANT: Ensure this matches your data key
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#9ca3af", fontSize: 12 }} 
            dy={10}
          />

          {/* Y Axis */}
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#9ca3af", fontSize: 12 }} 
          />

          {/* Tooltip: Show details on hover */}
          <Tooltip
            cursor={{ fill: "#f3f4f6" }}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            // Format display names in the tooltip for better UI
            formatter={(value: number, name: string) => {
               if (name === "hours") return [`${value} giờ`, "Giờ học"];
               if (name === "exams") return [`${value} bài`, "Số bài thi"];
               return [value, name];
            }}
            labelStyle={{ color: "#374151", fontWeight: "bold", marginBottom: "4px" }}
          />

          {/* Legend Config */}
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: "12px", fontWeight: 500 }}
            // Localize names in the Legend
            formatter={(value) => {
              if (value === "hours") return "Giờ học";
              if (value === "exams") return "Số bài thi";
              return value;
            }}
          />

          {/* Bar 1: Study Hours (Teal Color) */}
          <Bar 
            dataKey="hours" 
            name="hours" // Use key to map with the legend formatter above
            fill="#0d9488" 
            radius={[4, 4, 0, 0]} 
            barSize={12} 
          />

          {/* Bar 2: Exams Taken (Purple Color) */}
          <Bar 
            dataKey="exams" 
            name="exams" 
            fill="#8b5cf6" 
            radius={[4, 4, 0, 0]} 
            barSize={12}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;