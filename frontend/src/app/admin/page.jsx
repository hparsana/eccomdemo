"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const Admin = () => {
  const { userLoggedIn, authUser } = useSelector((data) => data?.userAuthData);

  const router = useRouter();
  useEffect(() => {
    if (userLoggedIn && authUser.role === "ADMIN") {
      router.push("/admin/dashboard"); // Redirect to home Admin
    } else {
      router.push("/"); // Redirect to home Admin
    }
  }, [userLoggedIn, router]);

  return <div>ADMIN</div>;
};

export default Admin;
