"use client";

import {
  AlertCircle,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Home,
  Layers3,
  LockIcon,
  LucideIcon,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { useGetProjectsQuery } from "@/state/api";

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(false);
  const [showPriority, setShowPriority] = useState(false);

  const { data } = useGetProjectsQuery();
  // todo fix three calls
  const projects = data?.data;
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  return (
    <div
      className={`z-40 flex h-[100%] flex-col justify-start overflow-x-visible bg-white shadow-xl transition-all duration-500 dark:bg-black ${isSidebarCollapsed ? "hidden w-0" : "min-w-64"}`}
    >
      <div className="flex w-full items-center justify-between p-2 md:px-4 md:py-2">
        <div className="text-lg font-bold text-gray-800 dark:text-white">
          EDLIS<span className="text-blue-600">T</span>
        </div>
        {isSidebarCollapsed ? null : (
          // todo add transition duration 500
          <button
            className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
            title="x"
            onClick={() => {
              dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
            }}
          >
            <X className="h-6 w-6 pt-1 text-gray-800 hover:text-gray-500 dark:text-white" />
          </button>
        )}
      </div>
      {/* TEAM */}
      <div className="flex items-center justify-between gap-5 border-y-[1.5px] border-gray-200 px-2 py-4 dark:border-gray-700 ">
        <Image src="/logo.png" alt="logo" width={40} height={40} />
        <div className="">
          <h3 className="mt-1 flex items-center justi tracking-wide dark:text-gray-200  text-xs text-nowrap">
            LRX Team
          </h3>

          <div className="mt-1 flex items-start gap-2">
            <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
            <p className="text-[10px] text-gray-500 md:text-xs">Private</p>
          </div>
        </div>
      </div>

      {/* navbar LINKS */}
      {/* !TODO add here the space left */}
      <nav className="flex w-full flex-col justify-start gap-2 p-2">
        <SidebarLink href="/" icon={Home} label="Home" />
        <SidebarLink href="/briefcase" icon={Briefcase} label="Projects" />
        <SidebarLink href="/search" icon={Search} label="Search" />
        <SidebarLink href="/settings" icon={Settings} label="Settings" />
        <SidebarLink href="/users" icon={User} label="User" />
        <SidebarLink href="/user" icon={Users} label="Users" />
      </nav>

      {/* Project Show ++ List */}
      <button
        title="asd"
        onClick={() => setShowProjects((prev) => !prev)}
        className={`flex items-center justify-between px-8 py-3 text-gray-500`}
      >
        <p className="text-sm">Projects</p>
        {showProjects ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>
      {/* //TODO check here out */}
      {showProjects &&
        projects?.map((project) => (
          <SidebarLink
            key={project.id}
            href={`/projects/${project.id}`}
            icon={Briefcase}
            label={project.name}
          />
        ))}

      {/* priority Show + List */}
      <button
        title="asd"
        onClick={() => setShowPriority((prev) => !prev)}
        className={`flex items-center justify-between px-8 py-3 text-gray-500`}
      >
        <p className="text-sm">Priority</p>
        {showPriority ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>
      {showPriority && (
        <>
          <SidebarLink icon={AlertCircle} label="Priority" href="/priority" />
          <SidebarLink icon={ShieldAlert} label="Security" href="/security" />
          <SidebarLink icon={AlertTriangle} label="Alerts" href="/alerts" />
          <SidebarLink icon={Layers3} label="Layers" href="/layers" />
        </>
      )}
      {/* project list */}
    </div>
  );
};
interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  // isCollapsed: boolean;
}
const SidebarLink = ({
  href,
  icon: Icon,
  label: title,
  // isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");
  // const screenWidth = window.innerWidth;
  // const dispatch = useAppDispatch();
  // const isSidebarCollapsed = useAppSelector(
  //   (state) => state.global.isSidebarCollapsed,
  // );

  return (
    <Link href={href} className="w-full">
      <div
        className={`transition-color relative flex cursor-pointer items-center gap-3 rounded p-2 transition duration-300 hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${
          isActive ? `bg-gray-100 text-gray-900 dark:bg-gray-600` : ""
        } `}
      >
        <Icon className={`} h-6 w-6 dark:text-gray-200`} />
        <p className={`text-sm dark:text-gray-200`}>{title}</p>
      </div>
    </Link>
  );
};

export default Sidebar;
