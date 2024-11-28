"use client";
import {
  applyMiddleware,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import Auth from "./Auth/auth.slice";
const rootReducer = combineReducers({
  userAuthData: Auth,
});

export const store = configureStore(
  {
    reducer: rootReducer,
  },
  applyMiddleware()
);
