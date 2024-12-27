import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSavedProducts,
  saveProduct,
  unsaveProduct,
} from "./savedProductApi";

// Initial State
const getInitialState = () => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("likedProducts")) || [];
  }
  return [];
};

const savedProductSlice = createSlice({
  name: "savedProducts",
  initialState: {
    savedProducts: getInitialState(),
    loading: false,
    error: null,
  },
  reducers: {
    // No additional reducers needed as thunks handle the state updates
  },
  extraReducers: (builder) => {
    // Fetch Saved Products
    builder.addCase(fetchSavedProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSavedProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.savedProducts = action.payload;
    });
    builder.addCase(fetchSavedProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Save Product
    builder.addCase(saveProduct.fulfilled, (state, action) => {
      const product = action.payload;
      const alreadySaved = state.savedProducts.some(
        (item) => item._id === product._id
      );
      if (!alreadySaved) {
        state.savedProducts.push(product);
      }
    });

    builder.addCase(saveProduct.rejected, (state, action) => {
      state.error = action.payload;
    });

    // Unsave Product
    builder.addCase(unsaveProduct.fulfilled, (state, action) => {
      state.savedProducts = state.savedProducts.filter(
        (item) => item._id !== action.payload
      );
    });

    builder.addCase(unsaveProduct.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export default savedProductSlice.reducer;
