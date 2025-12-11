"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserRole } from "@/features/dashboard/types";

interface DashboardContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  userName: string;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
}) => {
  // TODO: Replace with actual user data from auth context/session
  const [activeTab, setActiveTab] = useState("exams");
  const [userRole] = useState<UserRole>("student");
  const [userName] = useState("Student");

  return (
    <DashboardContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userRole,
        userName,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
