"use client";
import { createSlice } from "@reduxjs/toolkit";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "./categoryApi";

const CategorySlice = createSlice({
  name: "categories",
  initialState: {
    categoryList: [], // List of categories
    totalCategories: 0, // Total number of categories
    loading: false, // Loading state
    error: null, // Error message
  },
  reducers: {
    resetCategories: (state) => {
      state.categoryList = [];
      state.totalCategories = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        // Ensure the payload structure matches the API response
        const categories = action.payload || [];
        state.categoryList = categories;
        state.totalCategories = categories.length;
        state.loading = false;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch categories.";
      })
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categoryList.push(action.payload);
        state.loading = false;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add category.";
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const updatedCategory = action.payload;
        const index = state.categoryList.findIndex(
          (cat) => cat._id === updatedCategory._id
        );
        if (index !== -1) {
          state.categoryList[index] = updatedCategory;
        }
        state.loading = false;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update category.";
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const deletedCategoryId = action.payload;
        state.categoryList = state.categoryList.filter(
          (cat) => cat._id !== deletedCategoryId
        );
        state.loading = false;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete category.";
      });
  },
});

const { actions, reducer } = CategorySlice;
export const { resetCategories } = actions;
export default reducer;
