"use client";
import {
  applyMiddleware,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import Auth from "./Auth/auth.slice";
import User from "./User/user.Slice";

const rootReducer = combineReducers({
  userAuthData: Auth,
  userData: User,
});

export const store = configureStore(
  {
    reducer: rootReducer,
  },
  applyMiddleware()
);
