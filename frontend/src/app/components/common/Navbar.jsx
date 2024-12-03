"use client";
// src/app/components/common/Navbar.jsx
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Use usePathname from next/navigation
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { LogoutUserFun } from "@/app/store/Auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AdminRoute = [
  {
    path: "/admin/dashboard",
  },
  {
    path: "/product",
  },
  {
    path: "/logout",
  },
];

const Navbar = () => {
  const pathname = usePathname(); // Get the current path
  const { userLoggedIn, authUser } = useSelector((data) => data?.userAuthData);
  const router = useRouter();
  const dispatch = useDispatch();
  const isActive = (path) => pathname === path;
  const handleLogou = () => {
    dispatch(LogoutUserFun());
    toast.success("Logout Successful!");

    router.push("/login");
  };

  return (
    <div>
      <div className="w-full bg-[#EAE8E2]">
        <div className="container h-[97px] mx-auto flex items-center justify-between">
          <div>
            <motion.div
              className="card"
              initial={{ opacity: 1, x: -100 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }} // Only animate once
            >
              <Image
                src="/images/header_logo.png"
                alt="logo"
                height={57}
                width={134}
              />
            </motion.div>
          </div>
          <div>
            {userLoggedIn ? (
              <ul className="flex gap-[60px]">
                {authUser?.role === "ADMIN"
                  ? AdminRoute.map((item) =>
                      item.path === "/logout" ? (
                        <li key={item.path} onClick={handleLogou}>
                          <Link
                            href={item.path}
                            className={`font-semibold text-[18px] leading-[27px] cursor-pointer transition duration-300 px-2 py-1 rounded ${
                              isActive(item.path)
                                ? "bg-[#C7C1C2] text-[#FFF]"
                                : "hover:bg-[#C7C1C2] hover:text-[#FFF]"
                            }`}
                          >
                            {item.path === "/"
                              ? "Home"
                              : item.path === "/admin/dashboard"
                                ? "Dashboard"
                                : item.path.charAt(1).toUpperCase() +
                                  item.path.slice(2)}
                          </Link>
                        </li>
                      ) : (
                        <li key={item.path}>
                          <Link
                            href={item.path}
                            className={`font-semibold text-[18px] leading-[27px] cursor-pointer transition duration-300 px-2 py-1 rounded ${
                              isActive(item.path)
                                ? "bg-[#C7C1C2] text-[#FFF]"
                                : "hover:bg-[#C7C1C2] hover:text-[#FFF]"
                            }`}
                          >
                            {item.path === "/"
                              ? "Home"
                              : item.path === "/admin/dashboard"
                                ? "Dashboard"
                                : item.path.charAt(1).toUpperCase() +
                                  item.path.slice(2)}
                          </Link>
                        </li>
                      )
                    )
                  : ["/", "/product", "/logout"].map((path) =>
                      path === "/logout" ? (
                        <li key={path} onClick={handleLogou}>
                          <Link
                            href={path}
                            className={`font-semibold text-[18px] leading-[27px] cursor-pointer transition duration-300 px-2 py-1 rounded ${
                              isActive(path)
                                ? "bg-[#C7C1C2] text-[#FFF]"
                                : "hover:bg-[#C7C1C2] hover:text-[#FFF]"
                            }`}
                          >
                            {path === "/"
                              ? "Home"
                              : path === "/admin/dashboard"
                                ? "Dashboard"
                                : path.charAt(1).toUpperCase() + path.slice(2)}
                          </Link>
                        </li>
                      ) : (
                        <li key={path}>
                          <Link
                            href={path}
                            className={`font-semibold text-[18px] leading-[27px] cursor-pointer transition duration-300 px-2 py-1 rounded ${
                              isActive(path)
                                ? "bg-[#C7C1C2] text-[#FFF]"
                                : "hover:bg-[#C7C1C2] hover:text-[#FFF]"
                            }`}
                          >
                            {path === "/"
                              ? "Home"
                              : path === "/admin/dashboard"
                                ? "Dashboard"
                                : path.charAt(1).toUpperCase() + path.slice(2)}
                          </Link>
                        </li>
                      )
                    )}
              </ul>
            ) : (
              <ul className="flex gap-[60px]">
                {["/", "/product", "/register", "/login"].map((path) => (
                  <li key={path}>
                    <Link
                      href={path}
                      className={`font-semibold text-[18px] leading-[27px] cursor-pointer transition duration-300 px-2 py-1 rounded ${
                        isActive(path)
                          ? "bg-[#C7C1C2] text-[#FFF]"
                          : "hover:bg-[#C7C1C2] hover:text-[#FFF]"
                      }`}
                    >
                      {path === "/"
                        ? "Home"
                        : path.charAt(1).toUpperCase() + path.slice(2)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <motion.div
              className="card"
              initial={{ opacity: 1, x: 100 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }} // Only animate once
            >
              <div className="flex items-center gap-[25px]">
                <Image
                  src="/images/search_icon.png"
                  className="cursor-pointer w-[24px] h-[24px]"
                  alt="search_icon"
                  height={24}
                  width={24}
                />
                <div className="h-7 w-[2px] bg-[#7B6E62] opacity-35"></div>
                <Image
                  src="/images/cart_icon.png"
                  className="cursor-pointer w-[24.68px] h-[23.99px]"
                  alt="cart_icon"
                  height={24}
                  width={24}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <hr className="w-full h-[2px] bg-[#C7C1C2]" />
    </div>
  );
};

export default Navbar;
