"use client";
import { createSlice } from "@reduxjs/toolkit";
import { getAllProducts } from "./productApi";

const ProductSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    facets: null,
    totalProducts: 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null,
  },
  reducers: {
    ResetProducts: (state) => {
      state.productList = [];
      state.facets = null;
      state.totalProducts = 0;
      state.totalPages = 0;
      state.currentPage = 1;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        const { products, totalProducts, totalPages, currentPage, facets } =
          action.payload;

        state.productList = products;
        state.totalProducts = totalProducts;
        state.facets = facets;
        state.totalPages = totalPages;
        state.currentPage = currentPage;
        state.loading = false;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products.";
      });
  },
});

const { actions, reducer } = ProductSlice;
export const { ResetProducts } = actions;
export default reducer;
