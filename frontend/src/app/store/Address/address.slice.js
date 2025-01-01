import { createSlice } from "@reduxjs/toolkit";
import {
  getAllAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "./addressApi";

const AddressSlice = createSlice({
  name: "addresses",
  initialState: {
    addressList: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetAddresses: (state) => {
      state.addressList = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addressList = action.payload;
      })
      .addCase(getAllAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addressList.push(action.payload);
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.addressList.findIndex(
          (address) => address._id === action.payload._id
        );
        if (index !== -1) {
          state.addressList[index] = action.payload;
        }
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addressList = state.addressList.filter(
          (address) => address._id !== action.payload._id
        );
      });
  },
});

const { actions, reducer } = AddressSlice;
export const { resetAddresses } = actions;
export default reducer;
