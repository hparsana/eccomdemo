import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ERROR_LOGS } from "@/app/utils/constant";
import { axiosInstance } from "@/app/utils/axiosInstance";

export const getErrorLogs = createAsyncThunk(
  "errorLogs/getErrorLogs",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.get(ERROR_LOGS.GET_ERROR_LOGS);

      if (response.data.success) {
        return response.data.data;
      }

      return rejectWithValue("Failed to fetch error logs.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
