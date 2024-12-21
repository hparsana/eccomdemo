import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { PRODUCTS } from "@/app/utils/constant";

export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async (
    {
      page = 1,
      limit = 10,
      search = "",
      sort = "-createdAt",
      category,
      brand,
      minPrice,
      maxPrice,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        PRODUCTS.GET_ALL_PRODUCTS,
        {},
        {
          params: {
            page,
            limit,
            search,
            sort,
            category,
            brand,
            minPrice,
            maxPrice,
          },
        }
      );

      if (response.data.success) {
        return response.data.data; // Ensure your API returns the expected response structure
      }

      return rejectWithValue("Failed to fetch products.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(PRODUCTS.ADD_PRODUCT, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        return response.data.data; // Ensure API returns the newly created product
      }

      return rejectWithValue("Failed to add product.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.put(
        `${PRODUCTS.UPDATE_PRODUCT}/${id}`, // API endpoint for updating a product
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response);

      if (response.data.success) {
        return response.data.data; // Ensure API returns the updated product
      }

      return rejectWithValue("Failed to update product.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.delete(
        `${PRODUCTS.DELETE_PRODUCT}/${id}`, // API endpoint for deleting a product
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        return id; // Return the ID of the deleted product
      }

      return rejectWithValue("Failed to delete product.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getProductById = createAsyncThunk(
  "products/getProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${PRODUCTS.GET_ONE_PRODUCTS}/${id}`,
        {}
      );

      if (response.data.success) {
        return response.data.data; // Return the product data
      }

      return rejectWithValue("Failed to fetch product details.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addReview = createAsyncThunk(
  "products/addReview",
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        `${PRODUCTS.ADD_REVIEW}/${productId}`, // Replace with your API endpoint
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        return response.data.data; // Return the updated product with reviews
      }

      return rejectWithValue("Failed to add review.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateReview = createAsyncThunk(
  "products/updateReview",
  async ({ productId, reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.put(
        `${PRODUCTS.UPDATE_REVIEW}/${productId}/reviews/${reviewId}`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        return response.data.data; // Return updated product data
      }

      return rejectWithValue("Failed to update review.");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
