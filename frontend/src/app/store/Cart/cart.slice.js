"use client";
import { createSlice } from "@reduxjs/toolkit";

// Helper function to save cart to localStorage
const saveCartToLocalStorage = (cartItems) => {
  localStorage.setItem("cart", JSON.stringify(cartItems));
};

// Helper function to get cart from localStorage
const getCartFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  }
  return [];
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: getCartFromLocalStorage(),
  },
  reducers: {
    addItemToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.cartItems.push(item);
      }

      saveCartToLocalStorage(state.cartItems);
    },
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((cartItem) => cartItem.id === id);

      if (item) {
        item.quantity = quantity > 0 ? quantity : 1;
      }

      saveCartToLocalStorage(state.cartItems);
    },
    removeItemFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== action.payload
      );

      saveCartToLocalStorage(state.cartItems);
    },
    clearCart: (state) => {
      state.cartItems = [];
      saveCartToLocalStorage([]);
    },
  },
});

export const {
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
