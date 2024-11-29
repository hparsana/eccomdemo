"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import withAuth from "../components/Auth/withAuth";

const Admin = () => {
  const { userLoggedIn } = useSelector((data) => data?.userAuthData);

  const router = useRouter();
  useEffect(() => {
    if (userLoggedIn) {
      router.push("/admin/dashboard"); // Redirect to home Admin
    }
  }, [userLoggedIn, router]);

  return <div>ADMIN</div>;
};

export default withAuth(Admin, true);
