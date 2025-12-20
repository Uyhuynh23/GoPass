"use client";

import React, { useEffect } from "react";
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
  const { userRole, userName, activeTab, setActiveTab } = useDashboard();
  const searchParams = useSearchParams();

  // Allow deep links to specific tabs, e.g. /dashboard?tab=practice
  useEffect(() => {
    const tabFromQuery = searchParams?.get("tab");
    if (tabFromQuery && tabFromQuery !== activeTab) {
      setActiveTab(tabFromQuery);
    }
  }, [searchParams, activeTab, setActiveTab]);

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
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardProvider>
  );
};

export default DashboardLayout;
