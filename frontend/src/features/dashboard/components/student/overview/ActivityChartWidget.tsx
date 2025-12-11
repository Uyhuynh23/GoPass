import React from "react";
// Ensure you have this component created (using Recharts or similar library)
import PerformanceChart from "./PerformanceChart"; 
import { PerformanceDataPoint } from "@/features/dashboard/types/student";

interface ActivityChartWidgetProps {
  data: PerformanceDataPoint[];
}

const ActivityChartWidget: React.FC<ActivityChartWidgetProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-teal-50 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-bold text-gray-700 flex items-center gap-2">
          <span className="text-blue-500 bg-blue-50 p-1.5 rounded-lg">📈</span> 
          Hoạt động 7 ngày qua
        </h3>
        <p className="text-xs text-gray-400 mt-1 pl-9">
          Số bài thi và thời gian học mỗi ngày
        </p>
      </div>
      
      {/* Chart Container - flex-1 ensures it fills remaining vertical space */}
      <div className="flex-1 min-h-[250px] w-full">
        <PerformanceChart data={data} />
      </div>
    </div>
  );
};

export default ActivityChartWidget;