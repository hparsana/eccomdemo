import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { USERS } from "@/app/utils/constant";
import { axiosInstance } from "@/app/utils/axiosInstance";
// import { useRouter } from "next/navigation";

export const getUserData = createAsyncThunk("auth/setDatas", async () => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axiosInstance.get(USERS.GET_USER_INFO);
    if (response?.data?.success) {
      return response?.data;
    }
    return [];
  } catch (error) {
    console.log("Error in Store Async thunk in Error Api Catch Block", error);
    throw error; // Optionally re-throw the error for further handling
  }
});

export const LogoutUserFun = createAsyncThunk("auth/deleteData", async () => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axiosInstance.get(USERS.LOGOUT_USER_API);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");

    return response?.data;
  } catch (error) {
    console.log(
      "Error in Logout Store Async thunk in Error Api Catch Block",
      error
    );
  }
});
