"use client";
import { createSlice } from "@reduxjs/toolkit";
import { LogoutUserFun, getUserData } from "./authApi";

// Helper to get initial dark mode state safely on the client
const getInitialDarkMode = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("darkMode") === "true";
  }
  return false; // Default to light mode
};

const applyDarkModeClass = (darkMode) => {
  if (typeof window !== "undefined") {
    const root = document.documentElement;

    // Add transition effect
    root.style.transition = "background-color 1s ease, color 5s ease";

    if (darkMode) {
      // Apply dark mode colors
      root.style.backgroundColor = "#121212"; // Dark background
      root.style.color = "#ffffff"; // Dark text
    } else {
      // Apply light mode colors
      root.style.backgroundColor = "#ffffff"; // Light background
      root.style.color = "#000000"; // Light text
    }
  }
};

const Auth = createSlice({
  name: "user",
  initialState: {
    userLoggedIn: false,
    authTokenGet: "",
    authUser: null,
    loading: false,
    darkMode: false, // Initialize with a default value
    hasHydrated: false, // To ensure client-only logic runs after hydration
  },
  reducers: {
    // User-related reducers
    LoginUsers: (state, action) => {
      state.userLoggedIn = true;
      state.authUser = action?.payload?.data || action?.payload || [];
    },
    LoginStateUpdater: (state) => {
      state.userLoggedIn = true;
    },

    // Dark Mode Reducers
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      // Update localStorage and document classList immediately
      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", state.darkMode);
        applyDarkModeClass(state.darkMode);
      }
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      // Update localStorage and document classList immediately
      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", state.darkMode);
        applyDarkModeClass(state.darkMode);
      }
    },
    setHasHydrated: (state) => {
      state.hasHydrated = true;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        const { payload } = action;
        state.userLoggedIn = true;
        state.authTokenGet = localStorage.getItem("token") || "";
        state.authUser = payload?.data || payload?.user;
        state.loading = false;
      })
      .addCase(getUserData.rejected, (state) => {
        state.loading = false;
      })
      .addCase(LogoutUserFun.pending, (state) => {
        state.loading = true;
      })
      .addCase(LogoutUserFun.fulfilled, (state) => {
        state.authTokenGet = "";
        state.userLoggedIn = false;
        state.authUser = null;
        state.loading = false;
      })
      .addCase(LogoutUserFun.rejected, (state) => {
        state.loading = false;
        state.userLoggedIn = false;
      });
  },
});

const { actions, reducer } = Auth;
export const {
  LoginUsers,
  LoginStateUpdater,
  toggleDarkMode,
  setDarkMode,
  setHasHydrated,
} = actions;
export default reducer;
