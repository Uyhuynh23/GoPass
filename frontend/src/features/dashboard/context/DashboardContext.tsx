"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { TeacherDataProvider } from "./TeacherDataContext";

type UserRole = "admin" | "teacher" | "student";

interface DashboardContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userRole, setUserRole] = useState<UserRole>("teacher");

  return (
    <DashboardContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
      }}
    >
      <TeacherDataProvider>
        {children}
      </TeacherDataProvider>
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};