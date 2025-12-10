"use client";

import React from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import DashboardNavigation from "@/components/layout/DashboardNavigation";
import {
  DashboardProvider,
  useDashboard,
} from "@/features/dashboard/context/DashboardContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayoutContent: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const { userRole, userName, activeTab, setActiveTab } = useDashboard();

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
