"use client";

import { useDispatch } from "react-redux";
import Navbar from "./common/Navbar";
import { getUserData } from "../store/Auth/authApi";
import { useEffect } from "react";

const Layout = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
