"use client";
import {
  applyMiddleware,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import Auth from "./Auth/auth.slice";
import User from "./User/user.Slice";
import Product from "./Product/product.slice";
import Order from "./Order/order.slice";
import SavedProduct from "./SaveProduct/savedProduct.slice";
import Cart from "./Cart/cart.slice"; // Import Cart reducer
import Category from "./Category/category.slice";
import Address from "./Address/address.slice";
import ErrorLog from "./ErrorLog/errorLog.slice";
const rootReducer = combineReducers({
  userAuthData: Auth,
  userData: User,
  productData: Product,
  orderData: Order,
  savedProductData: SavedProduct,
  cartData: Cart, // Add Cart reducer
  categoryData: Category, // Add Category reducer
  addressData: Address,
  errorLogData: ErrorLog, // Add ErrorLog reducer
});

export const store = configureStore(
  {
    reducer: rootReducer,
  },
  applyMiddleware()
);
