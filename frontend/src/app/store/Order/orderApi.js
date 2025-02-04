import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ORDERS } from "@/app/utils/constant";
import cache from "@/app/utils/cache";
import { axiosInstance } from "@/app/utils/axiosInstance";

// Fetch All Orders
export const getAllOrders = createAsyncThunk(
  "orders/getAllOrders",
  async (
    { page = 1, limit = 10, sort = "-createdAt", status, userId },
    { rejectWithValue }
  ) => {
    // ✅ Create a unique cache key based on filters
    const cacheKey = `orders-page-${page}-status-${status || "all"}-user-${userId || "all"}`;

    // ✅ Check if cached data exists
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Using cached orders for ${cacheKey}`);
      return cachedData;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.post(
        ORDERS.GET_ALL_ORDERS,
        {},
        {
          params: { page, limit, sort, status, userId },
        }
      );

      if (response.data.success) {
        cache.set(cacheKey, response.data.data); // ✅ Store response in cache
        return response.data.data;
      }

      return rejectWithValue("Failed to fetch orders.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const getOrdersStatitics = createAsyncThunk(
  "orders/getOrdersStatitics",
  async ({}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.get(ORDERS.GET_DASHBOARD_STATITICS);
      console.log("sdata is<<<<", response);

      if (response.data.success) {
        return response.data.data; // Ensure your API returns the expected response structure
      }

      return rejectWithValue("Failed to fetch orders.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const getProductSold = createAsyncThunk(
  "orders/getProductSold",
  async ({}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.get(
        ORDERS.GET_DASHBOARD_PRODUCTSOLD
      );

      if (response.data.success) {
        return response.data.data; // Ensure your API returns the expected response structure
      }

      return rejectWithValue("Failed to fetch orders.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
// Add Order
export const addOrder = createAsyncThunk(
  "orders/addOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.post(ORDERS.ADD_ORDER, orderData);

      if (response.data.success) {
        cache.clear(); // ✅ Clear cache when a new order is added
        return response.data.data; // Ensure API returns the newly created order
      }

      return rejectWithValue("Failed to add order.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete Order
export const UpdateOrder = createAsyncThunk(
  "orders/updateOrder",
  async ({ id, orderStatus }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      console.log("came here for update status");

      const response = await axiosInstance.put(
        `${ORDERS.UPDATE_ORDER_STATUS}/${id}`, // API endpoint for updating an order
        { orderStatus } // Pass orderStatus in the request body
      );

      if (response.data.success) {
        cache.clear(); // ✅ Clear cache when a new order is added
        return response.data.data; // Return updated order data
      }

      return rejectWithValue("Failed to update order.");
    } catch (error) {
      console.error(error);

      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete Order
export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.delete(
        `${ORDERS.DELETE_ORDER}/${id}` // API endpoint for deleting an order
      );

      if (response.data.success) {
        cache.clear(); // ✅ Clear cache when a new order is added
        return id; // Return the ID of the deleted order
      }

      return rejectWithValue("Failed to delete order.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getLastOrderByUserId = createAsyncThunk(
  "orders/getLastOrderByUserId",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axiosInstance.get(`${ORDERS.GET_LAST_ORDER}`, {
        params: orderId ? { orderId } : {}, // Pass orderId if available
      });

      if (response.data) {
        return response.data.data;
      }

      return rejectWithValue("Failed to fetch last order.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getLastOrdersByUserId = createAsyncThunk(
  "orders/getLastOrdersByUserId",
  async ({ userId, page = 1, limit = 10 }, { rejectWithValue }) => {
    const cacheKey = `last-orders-user-${userId}-page-${page}`;

    // ✅ Check cache before fetching
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Using cached last orders for ${cacheKey}`);
      return cachedData;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await axiosInstance.get(
        `${ORDERS.GET_LAST_ORDERS}?page=${page}&limit=${limit}`
      );

      if (response.data) {
        cache.set(cacheKey, response.data.data); // ✅ Store in cache
        return response.data.data;
      }

      return rejectWithValue("Failed to fetch last orders.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
