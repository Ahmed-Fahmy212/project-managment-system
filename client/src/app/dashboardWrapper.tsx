import React from "react";
import Navbar from "./(components)/Navbar";
import Sidebar from "./(components)/Sidebar";

const dashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      {/* sidebar */}
      <Sidebar />
      <main className="dark:bg-dark-bg w-full flex flex-col bg-gray-50 md:pl-64">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default dashboardWrapper;
