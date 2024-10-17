"use client";

import Image from "next/image";

const Sidebar = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const sidebarClassNames = ``;
  return (
    <div className={`fixed flex flex-col h-[100%] justify-start shadow-xl transition-all duration-300 z-40 dark:bg-black overflow-y-auto bg-white`}>
      <div className="flex h-[100%] w-full flex-col justify-center">
        <div className="text-l font-bold text-gray-800 dark:text-white">
          LRX | PMS
        </div>
      </div>
      {/* TEAM */}
      <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
        <Image src="/client/public/logo.png" alt="logo" width={40} height={40} />
      </div>
    </div>
  );
};

export default Sidebar;
