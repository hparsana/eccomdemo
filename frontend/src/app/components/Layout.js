"use client";

import { useDispatch, useSelector } from "react-redux";
import Navbar from "./common/Navbar";
import { getUserData } from "../store/Auth/authApi";
import { useEffect } from "react";

const Layout = ({ children }) => {
  const { userLoggedIn, authUser, loading } = useSelector(
    (state) => state?.userAuthData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  return (
    <>
      {authUser?.role !== "ADMIN" ? <Navbar /> : null}
      <main>{children}</main>
    </>
  );
};

export default Layout;
