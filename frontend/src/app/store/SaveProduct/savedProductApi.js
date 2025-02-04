import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SAVEDPRODUCT } from "@/app/utils/constant";
import cache from "@/app/utils/cache";
import { axiosInstance } from "@/app/utils/axiosInstance";

// Fetch Saved Products
export const fetchSavedProducts = createAsyncThunk(
  "savedProducts/fetchSavedProducts",
  async (_, { rejectWithValue, getState }) => {
    const { userLoggedIn } = getState().userAuthData;

    // ✅ Use cache if available
    const cacheKey = "saved-products";
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Using cached saved products`);
      return cachedData;
    }

    if (!userLoggedIn) {
      // ✅ Return local storage data for unauthenticated users
      const localSavedProducts =
        JSON.parse(localStorage.getItem("likedProducts")) || [];
      return localSavedProducts;
    }

    try {
      const response = await axiosInstance.get(
        `${SAVEDPRODUCT.GET_ALL_SAVEDPRODUCTS}`
      );

      if (response.data.success) {
        cache.set(cacheKey, response.data.data); // ✅ Store API response in cache
        return response.data.data;
      }

      return rejectWithValue("Failed to fetch saved products.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Save Product
export const saveProduct = createAsyncThunk(
  "savedProducts/saveProduct",
  async (product, { rejectWithValue, getState }) => {
    const { userLoggedIn } = getState().userAuthData;

    if (!userLoggedIn) {
      // Handle unauthenticated users by updating local storage
      const savedProducts =
        JSON.parse(localStorage.getItem("likedProducts")) || [];
      const alreadySaved = savedProducts.some(
        (item) => item._id === product._id
      );

      if (!alreadySaved) {
        const updatedProducts = [...savedProducts, product];
        localStorage.setItem("likedProducts", JSON.stringify(updatedProducts));
        return product;
      }

      return rejectWithValue("Product is already saved locally.");
    }

    try {
      const response = await axiosInstance.post(
        `${SAVEDPRODUCT.ADD_SAVEDPRODUCTS}`,
        { productId: product._id }
      );

      if (response.data.success) {
        cache.del("saved-products"); // ✅ Remove cached saved products
        return product;
      }

      return rejectWithValue("Failed to save product.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Unsave Product
export const unsaveProduct = createAsyncThunk(
  "savedProducts/unsaveProduct",
  async (productId, { rejectWithValue, getState }) => {
    const { userLoggedIn } = getState().userAuthData;

    if (!userLoggedIn) {
      // Handle unauthenticated users by updating local storage
      const savedProducts =
        JSON.parse(localStorage.getItem("likedProducts")) || [];
      const updatedProducts = savedProducts.filter(
        (item) => item._id !== productId
      );
      localStorage.setItem("likedProducts", JSON.stringify(updatedProducts));
      return productId;
    }

    try {
      const response = await axiosInstance.delete(
        `${SAVEDPRODUCT.DELETE_SAVEDPRODUCTS}`,
        {
          data: { productId },
        }
      );

      if (response.data.success) {
        cache.del("saved-products"); // ✅ Remove cached saved products
        return productId;
      }

      return rejectWithValue("Failed to unsave product.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
