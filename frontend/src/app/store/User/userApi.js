import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { USERS } from "@/app/utils/constant";

export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(USERS.GET_ALL_USERS, {
        params: { page, limit, search },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to fetch users.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
