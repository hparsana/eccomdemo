"use client";
import { createSlice } from "@reduxjs/toolkit";

const getCompareFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const savedCompare = localStorage.getItem("compareProducts");
    return savedCompare ? JSON.parse(savedCompare) : [];
  }
  return [];
};

const saveCompareToLocalStorage = (compareProducts) => {
  localStorage.setItem("compareProducts", JSON.stringify(compareProducts));
};

const compareProductSlice = createSlice({
  name: "compareProducts",
  initialState: {
    compareItems: getCompareFromLocalStorage(),
  },
  reducers: {
    addToCompare: (state, action) => {
      const item = action.payload;
      const exists = state.compareItems.find(
        (product) => product.id === item.id
      );

      if (!exists) {
        state.compareItems.push(item);
      }

      saveCompareToLocalStorage(state.compareItems);
    },
    removeFromCompare: (state, action) => {
      state.compareItems = state.compareItems.filter(
        (product) => product.id !== action.payload
      );

      saveCompareToLocalStorage(state.compareItems);
    },
    clearCompare: (state) => {
      state.compareItems = [];
      saveCompareToLocalStorage([]);
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare } =
  compareProductSlice.actions;
export default compareProductSlice.reducer;
