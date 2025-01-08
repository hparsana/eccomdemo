"use client";

import { setDarkMode, setHasHydrated } from "@/app/store/Auth/auth.slice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const DarkModeHandler = () => {
  const dispatch = useDispatch();
  const { hasHydrated, darkMode } = useSelector((state) => state.userAuthData);

  useEffect(() => {
    if (!hasHydrated) {
      const savedMode = localStorage.getItem("darkMode") === "true";
      dispatch(setDarkMode(savedMode));
      dispatch(setHasHydrated());
    }
  }, [hasHydrated, dispatch]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return null; // This component doesn't render anything
};

export default DarkModeHandler;
