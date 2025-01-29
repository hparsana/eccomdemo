"use client";
import { createSlice } from "@reduxjs/toolkit";
import {
  getAllOrders,
  addOrder,
  deleteOrder,
  UpdateOrder,
  getOrdersStatitics,
  getProductSold,
  getLastOrderByUserId,
  getLastOrdersByUserId,
} from "./orderApi";

const OrderSlice = createSlice({
  name: "orders",
  initialState: {
    orderList: [],
    statitics: {},
    productSold: [],
    lastOrders: [], // ✅ Store last 10 orders
    lastOrder: null, // Add field for last order
    totalOrders: 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null,
  },
  reducers: {
    ResetOrders: (state) => {
      state.orderList = [];
      state.totalOrders = 0;
      state.totalPages = 0;
      state.currentPage = 1;
      state.lastOrders = []; // ✅ Reset last 10 orders
      state.lastOrder = null; // Reset last order
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        const { orders, totalOrders, totalPages, currentPage } = action.payload;

        state.orderList = orders;
        state.totalOrders = totalOrders;
        state.totalPages = totalPages;
        state.currentPage = currentPage;
        state.loading = false;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch orders.";
      })
      .addCase(getOrdersStatitics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersStatitics.fulfilled, (state, action) => {
        state.statitics = action.payload;
        state.loading = false;
      })
      .addCase(getOrdersStatitics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch statitics.";
      })
      .addCase(getProductSold.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductSold.fulfilled, (state, action) => {
        state.productSold = action.payload;
        state.loading = false;
      })
      .addCase(getProductSold.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch soldProduct.";
      })
      // Add Order
      .addCase(addOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.orderList.unshift(action.payload); // Add new order to the list
        state.loading = false;
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add order.";
      }) // Fetch Last Order by User
      .addCase(getLastOrderByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLastOrderByUserId.fulfilled, (state, action) => {
        state.lastOrder = action.payload; // Store the last order
        state.loading = false;
      })
      .addCase(getLastOrderByUserId.rejected, (state, action) => {
        state.lastOrder = null; // Clear last order on failure
        state.loading = false;
        state.error = action.payload || "Failed to fetch last order.";
      }) // ✅ Fetch Last 10 Orders with Pagination
      .addCase(getLastOrdersByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLastOrdersByUserId.fulfilled, (state, action) => {
        state.lastOrders = action.payload.orders; // ✅ Store last 10 orders
        state.totalOrders = action.payload.totalOrders;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.loading = false;
      })
      .addCase(getLastOrdersByUserId.rejected, (state, action) => {
        state.lastOrders = [];
        state.loading = false;
        state.error = action.payload || "Failed to fetch last orders.";
      });
  },
});

const { actions, reducer } = OrderSlice;
export const { ResetOrders } = actions;
export default reducer;
