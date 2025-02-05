"use client";
import { createSlice } from "@reduxjs/toolkit";
import { getAllUsers, getUserActivity } from "./userApi";

const UserSlice = createSlice({
  name: "users",
  initialState: {
    userList: [],
    userActivity: [],
    userActivityTotalPages: 0,
    totalUsers: 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null,
  },
  reducers: {
    ResetUsers: (state) => {
      state.userList = [];
      state.userActivity = [];
      state.totalUsers = 0;
      state.totalPages = 0;
      state.currentPage = 1;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        const { users, totalUsers, totalPages, currentPage } = action.payload;
        state.userList = users;
        state.totalUsers = totalUsers;
        state.totalPages = totalPages;
        state.currentPage = currentPage;
        state.loading = false;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(getUserActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserActivity.fulfilled, (state, action) => {
        state.userActivity = action.payload?.data;
        state.userActivityTotalPages = action.payload?.totalPages;

        state.loading = false;
      })
      .addCase(getUserActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load activity";
      });
  },
});

const { actions, reducer } = UserSlice;
export const { ResetUsers } = actions;
export default reducer;
