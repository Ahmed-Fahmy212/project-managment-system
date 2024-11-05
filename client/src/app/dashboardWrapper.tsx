"use client";

import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";
/////////////////////////////////////////////////////////////////////////////
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  });

  //-----------------------------------------------------------------------------
  return (
    <div className="flex overscroll-none  flex-row h-svh w-full bg-gray-50 text-gray-900">
      {/* sidebar */}
      <Sidebar />
      <main className={`flex w-full h-full flex-col bg-gray-50 dark:bg-dark-bg ${isSidebarCollapsed ? '' : 'max-smallScreen:overflow-x-hidden'}`}>
        <Navbar />
        {children}
      </main>
    </div >
  );
};
/////////////////////////////////////////////////////////////////////////////

const dashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout> {children}</DashboardLayout>
    </StoreProvider>
  );
};

export default dashboardWrapper;
