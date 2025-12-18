"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "@/features/auth";
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
  const { user } = useAuth(); // Get user from auth context
  const [activeTab, setActiveTab] = useState("exams");

  // Use actual user data from auth context, with fallback defaults
  const userRole = (user?.role as UserRole) || "student";
  const userName = user?.name || "User";

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
