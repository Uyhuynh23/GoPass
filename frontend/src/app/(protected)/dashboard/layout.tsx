"use client";

import React, { useEffect, Suspense } from "react";
import DashboardHeader from "@/components/layout/dashboard/DashboardHeader";
import DashboardNavigation from "@/components/layout/dashboard/DashboardNavigation";
import {
  DashboardProvider,
  useDashboard,
} from "@/features/dashboard/context/DashboardContext";
import { useSearchParams } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayoutContent: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const { userRole, userName, activeTab, setActiveTab, isLoading } =
    useDashboard();
  const searchParams = useSearchParams();

  // Allow deep links to specific tabs, e.g. /dashboard?tab=practice
  useEffect(() => {
    const tabFromQuery = searchParams?.get("tab");
    if (tabFromQuery && tabFromQuery !== activeTab) {
      setActiveTab(tabFromQuery);
    }
  }, [searchParams, activeTab, setActiveTab]);

  // Show loading state while user data is being fetched
  if (isLoading || !userRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userRole={userRole} userName={userName} />
      <DashboardNavigation
        userRole={userRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <DashboardProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      }>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </Suspense>
    </DashboardProvider>
  );
};

export default DashboardLayout;
