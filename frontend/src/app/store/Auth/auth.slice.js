"use client";
import { createSlice } from "@reduxjs/toolkit";
import { LogoutUserFun, getUserData } from "./authApi";
const Auth = createSlice({
  name: "user",
  initialState: {
    userLoggedIn: false,
    authTokenGet: "",
    authUser: null,
    loading: false,
  },
  reducers: {
    //this is used for without calling apis directy send data into redux
    LoginUsers: (state, action) => {
      state.userLoggedIn = true;
      // state.authTokenGet = localStorage.getItem("accesstoken") || "";
      state.authUser = action?.payload?.data || action?.payload || [];
    },
    LoginStateUpdater: (state, action) => {
      state.userLoggedIn = true;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getUserData.pending, (state, param) => {
        state.loading = true;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        const { payload } = action;
        state.userLoggedIn = true;
        state.authTokenGet = localStorage.getItem("token") || "";
        state.authUser = payload?.data || payload?.user;
        state.loading = false;
      })
      .addCase(getUserData.rejected, (state, param) => {
        state.loading = false;
      })
      .addCase(LogoutUserFun.pending, (state, param) => {
        state.loading = true;
      })
      .addCase(LogoutUserFun.fulfilled, (state, action) => {
        state.authTokenGet = "";
        state.userLoggedIn = false;
        state.authUser = null;
        state.loading = false;
      })
      .addCase(LogoutUserFun.rejected, (state, param) => {
        state.loading = false;
        state.userLoggedIn = false;
      });
  },
});
const { actions, reducer } = Auth;
export const { LoginUsers, LoginStateUpdater } = actions;
export default reducer;
