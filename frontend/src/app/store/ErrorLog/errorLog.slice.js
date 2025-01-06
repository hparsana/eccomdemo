import { createSlice } from "@reduxjs/toolkit";
import { getErrorLogs } from "./errorLogApi";

const errorLogSlice = createSlice({
  name: "errorLogs",
  initialState: {
    logList: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetErrorLogs: (state) => {
      state.logList = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getErrorLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getErrorLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logList = action.payload;
      })
      .addCase(getErrorLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const { actions, reducer } = errorLogSlice;
export const { resetErrorLogs } = actions;
export default reducer;
