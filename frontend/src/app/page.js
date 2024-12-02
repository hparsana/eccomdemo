"use client";
import Image from "next/image";
import withAuth from "./components/Auth/withAuth";

const Home = () => {
  return <div className="">Home page</div>;
};

export default withAuth(Home, true, ["USER"]);
