"use client";
import axios from "axios";
import { LOCAL_PATH } from "./constant.jsx";
import { useEffect, useState } from "react";

axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: LOCAL_PATH, // Set your API base URL
  // timeout: 5000, // Set a timeout for requests
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-type": "Application/json",
  },
  withCredentials: true,
});

const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accessTokenFromStorage = localStorage.getItem("accessToken");
      setAccessToken(accessTokenFromStorage);
    }
  }, []);

  return accessToken;
};

instance.interceptors.request.use(
  (config) => {
    const accessToken = useAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const Abort = axios.CancelToken.source();

export default instance;
