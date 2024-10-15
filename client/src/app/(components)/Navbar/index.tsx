import React from "react";
import { Search, Settings } from "lucide-react";
import Link from "next/link";
const Navbar = () => {
  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
      {/* serch bar */}
      <div className="flex items-center gap-8">
        <div className="relative flex h-min w-[200px]">
          <Search className="absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white" />
          <input
            className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white"
            type="search"
            placeholder="search..."
          ></input>
        </div>
      </div>
      <div className="flex items-center">
        <Link href="/settings" className="rounded p-2 hover:bg-gray-100 w-min h-min ">
          <Settings className="h-6 w-6 cursor-pointer dark:text-white" />
        </Link>
        <div className="w-8 bg-white hidden md:inline-block"></div>
      </div>
    </div>
  );
};

export default Navbar;
