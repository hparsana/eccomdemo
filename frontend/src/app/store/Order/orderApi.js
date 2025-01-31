import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ORDERS } from "@/app/utils/constant";

// Fetch All Orders
export const getAllOrders = createAsyncThunk(
  "orders/getAllOrders",
  async (
    { page = 1, limit = 10, sort = "-createdAt", status, userId },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        ORDERS.GET_ALL_ORDERS,
        {},
        {
          params: {
            page,
            limit,
            sort,
            status,
            userId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
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
export const getOrdersStatitics = createAsyncThunk(
  "orders/getOrdersStatitics",
  async ({}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(ORDERS.GET_DASHBOARD_STATITICS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
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

      const response = await axios.get(ORDERS.GET_DASHBOARD_PRODUCTSOLD, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

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

      const response = await axios.post(ORDERS.ADD_ORDER, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.data.success) {
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

      const response = await axios.put(
        `${ORDERS.UPDATE_ORDER_STATUS}/${id}`, // API endpoint for updating an order
        { orderStatus }, // Pass orderStatus in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
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

      const response = await axios.delete(
        `${ORDERS.DELETE_ORDER}/${id}`, // API endpoint for deleting an order
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
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

      const response = await axios.get(`${ORDERS.GET_LAST_ORDER}`, {
        params: orderId ? { orderId } : {}, // Pass orderId if available
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
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
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.get(
        `${ORDERS.GET_LAST_ORDERS}?page=${page}&limit=${limit}`, // API URL
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data) {
        return response.data.data; // Return order details with pagination
      }

      return rejectWithValue("Failed to fetch last orders.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
