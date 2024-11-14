"use client";

import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
  }, [isDarkMode]);

  //-----------------------------------------------------------------------------
  return (
    <div className="bg-gray-50 flex flex-row h-svh overscroll-none text-gray-900 w-full">
      {/* sidebar */}
      <Sidebar />
      <main className={`overscroll-none flex flex-col w-full h-full bg-gray-50 dark:bg-dark-bg ${isSidebarCollapsed ? '' : 'max-smallScreen:overflow-x-hidden'}`}>
        <Navbar />
        <NuqsAdapter>{children}</NuqsAdapter>
      </main>
    </div >
  );
};
/////////////////////////////////////////////////////////////////////////////

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
}
);
const dashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <QueryClientProvider client={queryClient}>

        <DashboardLayout> {children}</DashboardLayout>
        <ReactQueryDevtools initialIsOpen={false} position='bottom' />
      </QueryClientProvider>
    </StoreProvider>
  );
};

export default dashboardWrapper;
