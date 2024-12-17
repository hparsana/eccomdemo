"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LogoutUserFun } from "@/app/store/Auth/authApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  AiOutlineHome,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import { FiBox } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
const Navbar = () => {
  const pathname = usePathname();
  const { userLoggedIn, authUser } = useSelector((state) => state.userAuthData);
  const { savedProducts } = useSelector((state) => state.savedProductData);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0); // State for saved items count

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    dispatch(LogoutUserFun());
    toast.success("Logout Successful!");
    router.push("/login");
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  const isActive = (path) => pathname === path;

  const navLinks = userLoggedIn
    ? authUser?.role === "ADMIN"
      ? [
          { path: "/", name: "Home" },
          { path: "/admin/dashboard", name: "Dashboard" },
          { path: "/productdata", name: "Products" },
          { path: "/logout", name: "Logout" },
        ]
      : [
          { path: "/", name: "Home" },
          { path: "/productdata", name: "Products" },
          { path: "/logout", name: "Logout" },
        ]
    : [
        { path: "/", name: "Home" },
        { path: "/productdata", name: "Products" },
        { path: "/register", name: "Register" },
        { path: "/login", name: "Login" },
      ];
  const navItems = [
    { path: "/", icon: <AiOutlineHome size={28} />, name: "Home" },
    { path: "/productdata", icon: <FiBox size={28} />, name: "Products" },
    {
      path: "/cart",
      icon: <AiOutlineShoppingCart size={28} />,
      name: "Cart",
      badge: 3, // Attach cart count to cart item
    },
    { path: "/profile", icon: <AiOutlineUser size={28} />, name: "Profile" },
  ];
  return (
    <nav className="bg-[#EAE8E2] shadow-md">
      {/* Main Navbar */}
      <div className=" md:w-[92%] w-full  mx-auto flex items-center justify-between py-4 md:px-6 px-3">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 1, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/">
            <Image
              src="/images/header_logo.png"
              alt="Logo"
              width={134}
              height={57}
              className="cursor-pointer"
            />
          </Link>
        </motion.div>

        {/* Centered Routes */}
        <ul className="hidden lg:flex gap-8">
          {navLinks.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                onClick={item.path === "/logout" ? handleLogout : null}
                className={`font-semibold text-[18px] px-3 py-1 rounded transition duration-300 ${
                  isActive(item.path)
                    ? "bg-[#C7C1C2] text-white"
                    : "hover:bg-[#C7C1C2] hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="hidden lg:flex items-center gap-6 relative">
          {/* Search Bar with Left-side Expansion */}
          <div className="flex items-center relative">
            {/* Expanding Input */}
            <div
              className={`absolute left-[-215px] top-1/2 -translate-y-1/2 flex items-center bg-white rounded-full shadow-md overflow-hidden transition-all duration-500 ${
                isSearchOpen ? "w-64 opacity-100" : "w-0 opacity-0"
              }`}
            >
              <input
                type="text"
                placeholder="Search..."
                className={`w-full px-4 py-2 text-gray-700 outline-none md:pr-12`}
              />
            </div>

            {/* Search Icon */}
            <button
              onClick={toggleSearch}
              className={`relative z-10 focus:outline-none flex items-center justify-center transition-all duration-300  ${isSearchOpen && "mr-5"} `}
            >
              <Image
                src="/images/search_icon.png"
                alt="Search Icon"
                width={24}
                height={24}
                className="cursor-pointer"
              />
            </button>
          </div>

          {/* Divider Line */}
          <div className="h-8 w-[2px] bg-[#C7C1C2] opacity-50"></div>

          {/* Cart Icon with Item Count */}
          <div className="flex items-center justify-center relative">
            <Image
              src="/images/cart_icon.png"
              alt="Cart Icon"
              width={25}
              height={24}
              className="cursor-pointer"
            />
            {/* Cart Badge */}
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              3 {/* Dynamic count */}
            </div>
          </div>
          <div className="h-8 w-[2px] bg-[#C7C1C2] opacity-50"></div>
          <div className="flex items-center justify-center relative">
            <Link href="/productdata/saveditem">
              <FaHeart className="cursor-pointer w-[25px] h-[25px] text-[#806c64]" />
              {/* Cart Badge */}
              {savedProducts?.length > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {savedProducts?.length}
                </div>
              )}
            </Link>
          </div>
          {userLoggedIn && (
            <>
              <div className="h-8 w-[2px] bg-[#C7C1C2] opacity-50"></div>
              <div className="flex items-center justify-center relative">
                <IoLogOut
                  className="cursor-pointer w-[30px] h-[30px] "
                  onClick={handleLogout}
                />
                {/* Cart Badge */}
              </div>
            </>
          )}
        </div>

        {/* Hamburger Menu for Small Screens */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden focus:outline-none text-[#7B6E62]"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {/* Sidebar for Small Screens */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-[#EAE8E2] shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:hidden z-50`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <Link href="/">
            <Image
              src="/images/header_logo.png"
              alt="Logo"
              width={100}
              height={40}
            />
          </Link>
          <button onClick={toggleSidebar} className="focus:outline-none">
            <svg
              className="w-8 h-8 text-[#7B6E62]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Sidebar Links */}
        <ul className="flex flex-col gap-6 p-4">
          {navLinks.map((item) => (
            <li
              key={item.path}
              onClick={() => {
                if (item.path === "/logout") handleLogout();
                toggleSidebar();
              }}
            >
              <Link
                href={item.path}
                className={`block text-lg font-medium px-3 py-2 rounded transition duration-300 ${
                  isActive(item.path)
                    ? "bg-[#C7C1C2] text-white"
                    : "hover:bg-[#C7C1C2] hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Navigation Bar for Small Screens */}
      <div className="fixed bottom-0 left-0 w-full bg-[#F7F7F7] shadow-lg lg:hidden z-50 rounded-t-[40px]">
        <ul className="flex justify-around items-center py-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <div
                  className={`relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                    isActive(item.path) ? "text-blue-500" : "text-gray-500"
                  } hover:text-blue-500`}
                >
                  {/* Icon */}
                  <div
                    className={`h-10 w-10 flex items-center justify-center rounded-full ${
                      isActive(item.path) ? "bg-blue-100" : "bg-transparent"
                    } transition-all duration-300`}
                  >
                    {item.icon}
                  </div>

                  {/* Badge for Cart Count */}
                  {item.name === "Cart" && item?.badge > 0 && (
                    <div className="absolute top-[-2px] -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge}
                    </div>
                  )}

                  {/* Text Below Icon */}
                  <span
                    className={`text-sm mt-1 font-medium ${
                      isActive(item.path) ? "text-blue-500" : "text-gray-600"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
