import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CATEGORIES } from "@/app/utils/constant";
import cache from "@/app/utils/cache";
import { axiosInstance } from "@/app/utils/axiosInstance";

// Fetch all categories
export const getAllCategories = createAsyncThunk(
  "categories/getAllCategories",
  async (_, { rejectWithValue }) => {
    const cacheKey = "categories";

    // ✅ Check if cached data exists
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Using cached categories`);
      return cachedData;
    }

    try {
      const response = await axiosInstance.get(CATEGORIES.GET_ALL_CATEGORIES);

      if (response.data.success) {
        cache.set(cacheKey, response.data.data); // ✅ Store API response in cache
        return response.data.data;
      }

      return rejectWithValue("Failed to fetch categories.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add a new category
export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.post(
        CATEGORIES.ADD_CATEGORY,
        categoryData
      );

      if (response.data.success) {
        cache.clear(); // ✅ Clear cache to refresh category list
        return response.data.data; // Return the newly created category
      }

      return rejectWithValue("Failed to add category.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update an existing category
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.put(
        `${CATEGORIES.UPDATE_CATEGORY}/${id}`,
        categoryData
      );

      if (response.data.success) {
        cache.del("categories"); // ✅ Remove cached categories to fetch updated list
        return response.data.data; // Return the updated category
      }

      return rejectWithValue("Failed to update category.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete a category
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.delete(
        `${CATEGORIES.DELETE_CATEGORY}/${id}`
      );

      if (response.data.success) {
        cache.del("categories"); // ✅ Remove cached categories
        return id; // Return the ID of the deleted category
      }

      return rejectWithValue("Failed to delete category.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add a new subcategory
export const addSubcategory = createAsyncThunk(
  "categories/addSubcategory",
  async ({ categoryId, subcategoryData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.post(
        `${CATEGORIES.ADD_SUBCATEGORY}/${categoryId}`,
        subcategoryData
      );

      if (response.data.success) {
        cache.del("categories"); // ✅ Remove cached categories to update list
        return response.data.data; // Return the updated category with the new subcategory
      }

      return rejectWithValue("Failed to add subcategory.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update an existing subcategory
export const updateSubcategory = createAsyncThunk(
  "categories/updateSubcategory",
  async (
    { categoryId, subcategoryId, subcategoryData },
    { rejectWithValue }
  ) => {
    try {
      console.log("<<<<<<<<<<<<<<", categoryId, subcategoryId);

      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.put(
        `${CATEGORIES.UPDATE_SUBCATEGORY}/${categoryId}/subcategories/${subcategoryId}`,
        subcategoryData
      );

      if (response.data.success) {
        cache.del("categories"); // ✅ Remove cached categories to refresh
        return response.data.data; // Return the updated category with the updated subcategory
      }

      return rejectWithValue("Failed to update subcategory.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete a subcategory
export const deleteSubcategory = createAsyncThunk(
  "categories/deleteSubcategory",
  async ({ categoryId, subcategoryId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.delete(
        `${CATEGORIES.DELETE_SUBCATEGORY}/${categoryId}/subcategories/${subcategoryId}`
      );

      if (response.data.success) {
        cache.del("categories"); // ✅ Remove cached categories
        return { categoryId, subcategoryId }; // Return IDs for further handling
      }

      return rejectWithValue("Failed to delete subcategory.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
