"use client";

import React, { useState } from "react";
import {
  FaHome,
  FaBox,
  FaChartBar,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { AiOutlineProduct } from "react-icons/ai";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUserFun } from "@/app/store/Auth/authApi";
import withAuth from "@/app/components/Auth/withAuth";
import UserProfileModal from "@/app/components/dialoge/UserProfileModal";
import Image from "next/image";
import { BiSolidError } from "react-icons/bi";
import { MdCategory } from "react-icons/md";
const DashboardLayout = ({ children }) => {
  const { authUser } = useSelector((state) => state?.userAuthData);
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar toggle state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu toggle state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: FaHome },
    { name: "Products", path: "/admin/dashboard/products", icon: FaBox },
    { name: "Users", path: "/admin/dashboard/users", icon: FaChartBar },
    { name: "Categorys", path: "/admin/dashboard/category", icon: MdCategory },
    { name: "Orders", path: "/admin/dashboard/orders", icon: AiOutlineProduct },
    { name: "Errors", path: "/admin/dashboard/errorlogs", icon: BiSolidError },
  ];

  const handleLogout = () => {
    dispatch(LogoutUserFun());
    toast.success("Logout Successful!");
    router.push("/login");
  };

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for Desktop */}
      <div
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } bg-gray-800 text-white transition-all duration-300 hidden lg:flex flex-col fixed h-full dark:bg-gray-800`}
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-between h-[54.5px]">
          {!isCollapsed && (
            <span className="ml-4 font-medium mt-2 dark:text-gray-200">
              ADMIN
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-4 focus:outline-none mt-3 flex items-center ${
              isCollapsed ? "justify-center" : "justify-end"
            }`}
          >
            {isCollapsed ? (
              <FaBars className="h-5 w-5 ml-4" />
            ) : (
              <FaTimes className="h-5 w-5" />
            )}
          </button>
        </div>
        {/* Menu Items */}
        <nav className="flex flex-col gap-3 flex-grow mt-8 overflow-hidden">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              passHref
              className={`flex items-center p-4 hover:bg-gray-700 dark:hover:bg-gray-600 transition ${
                pathname === item.path ? "bg-gray-600 dark:bg-gray-700" : ""
              } ${isCollapsed ? "justify-center" : "justify-start"}`}
            >
              <item.icon className="text-xl" />
              {!isCollapsed && (
                <span className="ml-4 dark:text-gray-200">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`flex items-center p-4 hover:bg-red-600 dark:hover:bg-red-500 transition ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
        >
          <FaSignOutAlt className="text-xl" />
          {!isCollapsed && <span className="ml-4">Logout</span>}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 z-50 lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        {/* Close Icon */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-bold dark:text-gray-200">Admin</h3>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl dark:text-gray-200"
          >
            <FaTimes />
          </button>
        </div>
        <nav className="mt-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className={`flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                pathname === item.path ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="mr-2 text-lg" />
              <span className="dark:text-gray-200">{item.name}</span>
            </Link>
          ))}
          <button
            className="flex items-center w-full px-4 py-3 text-left text-red-500 hover:bg-red-100 dark:hover:bg-red-500 dark:text-white"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </nav>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="absolute top-[26px] left-4 text-xl lg:hidden dark:text-gray-200"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <FaBars />
      </button>

      {/* Main Content */}
      <div
        className={`flex-grow transition-all duration-300 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Navbar */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 shadow-md">
          <h2 className="text-xl font-semibold lg:ml-0  ml-10 dark:text-gray-200">
            {pathname.split("/").slice(-1)[0].charAt(0).toUpperCase() +
              pathname.split("/").slice(-1)[0].slice(1)}
          </h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-200 hidden sm:block"
            />
            <div
              className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => setIsProfileModalOpen(true)}
            >
              <span className="text-lg font-bold text-gray-600 dark:text-gray-200">
                {authUser?.avatar ? (
                  <Image
                    src={authUser?.avatar}
                    width={200}
                    height={200}
                    alt="user_profile"
                    className="object-cover rounded-full"
                  />
                ) : (
                  authUser?.fullname?.charAt(0).toUpperCase() || "U"
                )}
              </span>
            </div>
          </div>
        </div>
        {children}
      </div>
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={authUser}
      />
    </div>
  );
};

export default withAuth(DashboardLayout, true, ["ADMIN"]);
