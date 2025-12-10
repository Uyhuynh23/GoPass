import React from "react";

const DashboardLoading: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar Skeleton */}
      <div className="flex gap-4">
        <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-48"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-40"></div>
      </div>

      {/* List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-lg p-5"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardLoading;
