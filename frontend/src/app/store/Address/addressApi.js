import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ADDRESSES } from "@/app/utils/constant";
import { axiosInstance } from "@/app/utils/axiosInstance";
import cache from "@/app/utils/cache";

// Fetch all addresses
export const getAllAddresses = createAsyncThunk(
  "addresses/getAllAddresses",
  async (_, { rejectWithValue }) => {
    const cacheKey = "addresses";

    // ✅ Check if cached data exists
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Using cached addresses`);
      return cachedData;
    }

    try {
      const response = await axiosInstance.get(ADDRESSES.GET_ALL);

      if (response.data.success) {
        cache.set(cacheKey, response.data.data); // ✅ Store API response in cache
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
      const response = await axiosInstance.post(ADDRESSES.ADD, addressData);

      if (response.data.success) {
        cache.clear(); // ✅ Clear cache to refresh address list
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
      const response = await axiosInstance.put(
        ADDRESSES.UPDATE.replace(":addressId", addressId),
        updatedData
      );

      if (response.data.success) {
        cache.del("addresses"); // ✅ Remove cached addresses to fetch updated list
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
      const response = await axiosInstance.delete(
        ADDRESSES.DELETE.replace(":addressId", addressId)
      );

      if (response.data.success) {
        cache.del("addresses"); // ✅ Remove cached addresses
        return response.data.data;
      }

      return rejectWithValue("Failed to delete address.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
