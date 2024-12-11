"use client";
import { createSlice } from "@reduxjs/toolkit";
import { getAllOrders, addOrder, deleteOrder, UpdateOrder } from "./orderApi";

const OrderSlice = createSlice({
  name: "orders",
  initialState: {
    orderList: [],
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
      })
      .addCase(UpdateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdateOrder.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(UpdateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add order.";
      })
      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        const deletedOrderId = action.payload;
        state.orderList = state.orderList.filter(
          (order) => order.id !== deletedOrderId
        );
        state.loading = false;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete order.";
      });
  },
});

const { actions, reducer } = OrderSlice;
export const { ResetOrders } = actions;
export default reducer;
