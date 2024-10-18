"use client";

import { LockIcon } from "lucide-react";
import Image from "next/image";

const Sidebar = () => {
  //   const [sidebarOpen, setSidebarOpen] = useState(false);
  //   const sidebarClassNames = ``;
  return (
    <div
      className={`z-40 flex h-[100%] w-64 flex-col justify-start overflow-y-auto bg-white shadow-xl transition-all duration-300 dark:bg-black`}
    >
      <div className="flex w-full flex-col justify-start items-start p-2">
        <div className="text-lg font-bold text-gray-800 dark:text-white">
          EDLIS<span className="text-blue-600">T</span>
        </div>
      </div>
      {/* TEAM */}
      <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
        <Image src="/logo.png" alt="logo" width={40} height={40} />
        <div className="">
          <h3 className="mt-1 flex items-center tracking-wide dark:text-gray-200">
            LRX Team
          </h3>

          <div className="mt-3 flex items-start gap-2">
            <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
            <p className="text-xs text-gray-500">Private</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Sidebar;
