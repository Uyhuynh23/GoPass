import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconBgColor = "bg-teal-100",
  iconColor = "text-teal-600",
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${iconBgColor} ${iconColor} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
