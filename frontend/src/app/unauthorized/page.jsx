"use client";
import React from "react";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

const Unauthorized = () => {
  const { userLoggedIn, authUser } = useSelector((data) => data?.userAuthData);

  const handleRedirect = () => {
    if (userLoggedIn && authUser) {
      if (authUser?.role === "ADMIN") {
        redirect("/admin/dashboard");
      } else if (authUser?.role === "USER") {
        redirect("/");
      } else {
        redirect("/login");
      }
    } else {
      redirect("/login");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[88vh] bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>
        <p className="text-gray-600 text-lg mb-6">
          You don't have permission to access this page.
        </p>
        <button
          onClick={handleRedirect}
          className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
