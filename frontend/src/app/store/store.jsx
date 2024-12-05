"use client";
import {
  applyMiddleware,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import Auth from "./Auth/auth.slice";
import User from "./User/user.Slice";
import Product from "./Product/product.slice";

const rootReducer = combineReducers({
  userAuthData: Auth,
  userData: User,
  productData: Product,
});

export const store = configureStore(
  {
    reducer: rootReducer,
  },
  applyMiddleware()
);
