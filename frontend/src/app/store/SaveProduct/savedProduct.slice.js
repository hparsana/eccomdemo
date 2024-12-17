"use client";
import { createSlice } from "@reduxjs/toolkit";

// Safely initialize savedProducts
const getInitialState = () => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("likedProducts")) || [];
  }
  return []; // Default to empty array for SSR
};

const savedProductSlice = createSlice({
  name: "savedProducts",
  initialState: {
    savedProducts: getInitialState(),
  },
  reducers: {
    addProduct: (state, action) => {
      const product = action.payload;
      const alreadySaved = state.savedProducts.some(
        (item) => item._id === product._id
      );
      if (!alreadySaved) {
        state.savedProducts.push(product);
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "likedProducts",
            JSON.stringify(state.savedProducts)
          );
        }
      }
    },
    removeProduct: (state, action) => {
      const productId = action.payload;
      state.savedProducts = state.savedProducts.filter(
        (item) => item._id !== productId
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "likedProducts",
          JSON.stringify(state.savedProducts)
        );
      }
    },
    loadSavedProducts: (state) => {
      if (typeof window !== "undefined") {
        state.savedProducts =
          JSON.parse(localStorage.getItem("likedProducts")) || [];
      }
    },
  },
});

export const { addProduct, removeProduct, loadSavedProducts } =
  savedProductSlice.actions;

export default savedProductSlice.reducer;
