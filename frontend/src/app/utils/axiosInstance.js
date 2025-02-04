import axios from "axios";

// ✅ Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Use environment variables for base URL
  headers: {
    "Content-type": "Application/json",
  },
  withCredentials: true, // Include credentials for cross-origin requests
  credentials: "include",
});

axiosInstance.defaults.withCredentials = true;

// ✅ Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // ✅ Retrieve token from localStorage
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Add a response interceptor (Handle expired tokens globally)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token expired. Redirecting to login...");
      localStorage.removeItem("accessToken"); // Clear expired token
      window.location.href = "/login"; // Redirect user to login
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };
