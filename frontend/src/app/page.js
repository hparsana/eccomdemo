"use client";
import withAuth from "./components/Auth/withAuth";

const Home = () => {
  return <div className="">Home page</div>;
};

export default withAuth(Home, true, ["USER"]);
