import { useEffect, useMemo } from "react";
import axios from "axios";
import { LOCAL_PATH } from "./constant.jsx";

const useAxios = () => {
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: LOCAL_PATH, // Set your API base URL
      headers: {
        "Content-type": "Application/json",
      },
      withCredentials: true, // Include credentials for cross-origin requests
    });

    // Request Interceptor
    instance.interceptors.request.use(
      (config) => {
        const accessTokenFromStorage = localStorage.getItem("accessToken");
        if (accessTokenFromStorage) {
          config.headers.Authorization = `Bearer ${accessTokenFromStorage}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor (Optional: For error handling globally)
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // You can handle errors globally here (e.g., redirecting on 401)
        if (error.response && error.response.status === 401) {
          // Handle unauthorized errors (e.g., redirect to login)
          console.error("Unauthorized! Redirecting to login...");
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  useEffect(() => {
    // Clean up the Axios interceptors if the component using this hook unmounts
    return () => {
      axiosInstance.interceptors.request.eject();
      axiosInstance.interceptors.response.eject();
    };
  }, [axiosInstance]);

  return axiosInstance;
};

export default useAxios;
