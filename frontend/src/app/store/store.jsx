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

const rootReducer = combineReducers({
  userAuthData: Auth,
  userData: User,
  productData: Product,
  orderData: Order,
  savedProductData: SavedProduct,
});

export const store = configureStore(
  {
    reducer: rootReducer,
  },
  applyMiddleware()
);
