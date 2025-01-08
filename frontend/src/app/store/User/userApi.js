import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { USERS } from "@/app/utils/constant";
import { toast } from "react-toastify";

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

      console.log("come in this<<2", response);
      if (response.data.success) {
        return response.data.data;
      }

      return rejectWithValue("Failed to fetch users.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const editUser = createAsyncThunk(
  "users/editUser",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.put(
        `${USERS.UPDATE_USER_INFO_BYADMIN}/${userId}`, // Endpoint for editing user
        userData, // User data to be updated
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        return response.data.data; // Assuming the API returns the updated user
      }

      return rejectWithValue("Failed to edit user.");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return;
    }
  }
);
