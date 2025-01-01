import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ADDRESSES } from "@/app/utils/constant";

// Fetch all addresses
export const getAllAddresses = createAsyncThunk(
  "addresses/getAllAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(ADDRESSES.GET_ALL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        return response.data.data;
      }

      return rejectWithValue("Failed to fetch addresses.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add a new address
export const addAddress = createAsyncThunk(
  "addresses/addAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(ADDRESSES.ADD, addressData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        return response.data.data;
      }

      return rejectWithValue("Failed to add address.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update an address
export const updateAddress = createAsyncThunk(
  "addresses/updateAddress",
  async ({ addressId, updatedData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.put(
        ADDRESSES.UPDATE.replace(":addressId", addressId),
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        return response.data.data;
      }

      return rejectWithValue("Failed to update address.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete an address
export const deleteAddress = createAsyncThunk(
  "addresses/deleteAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.delete(
        ADDRESSES.DELETE.replace(":addressId", addressId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        return response.data.data;
      }

      return rejectWithValue("Failed to delete address.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
