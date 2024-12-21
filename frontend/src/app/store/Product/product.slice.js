"use client";
import { createSlice } from "@reduxjs/toolkit";
import { getAllProducts, getProductById } from "./productApi";

const ProductSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    productOne: null,
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
      state.productOne = null;
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
      })
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.productOne = null; // Reset selected product
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.productOne = action.payload; // Store fetched product
        state.loading = false;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch product details.";
        state.productOne = null;
      });
  },
});

const { actions, reducer } = ProductSlice;
export const { ResetProducts } = actions;
export default reducer;
