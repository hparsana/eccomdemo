"use client";
import React, { useState } from "react";
import {
  FaHome,
  FaBox,
  FaChartBar,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { LogoutUserFun } from "@/app/store/Auth/authApi";
import { useDispatch } from "react-redux";
import Link from "next/link";
import withAuth from "@/app/components/Auth/withAuth";

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Sidebar toggle state
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaHome /> },
    { name: "Products", path: "/admin/dashboard/products", icon: <FaBox /> },
    { name: "Users", path: "/admin/dashboard/users", icon: <FaChartBar /> },
  ];

  const handleLogout = () => {
    dispatch(LogoutUserFun());
    toast.success("Logout Successful!");

    router.push("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } bg-gray-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-4 focus:outline-none flex items-center ${
            isCollapsed ? "justify-center" : "justify-end"
          }`}
        >
          {isCollapsed ? (
            <FaBars className="h-5 w-5" />
          ) : (
            <FaTimes className="h-5 w-5" />
          )}
        </button>

        {/* Menu Items */}
        <nav className="flex flex-col flex-grow mt-5">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              passHref
              className={`flex items-center p-4 mt-4 hover:bg-gray-700 transition ${
                isCollapsed ? "justify-center" : "justify-start"
              } ${pathname === item.path ? "bg-gray-600" : ""}`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && <span className="ml-4">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`flex items-center p-4 hover:bg-red-600 transition ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
        >
          <FaSignOutAlt className="text-xl" />
          {!isCollapsed && <span className="ml-4">Logout</span>}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-100">{children}</div>
    </div>
  );
};

export default withAuth(DashboardLayout, true, ["ADMIN"]);
