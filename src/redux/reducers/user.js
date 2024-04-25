import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: true,
  loading: false,
  user: null,
  error: null,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    // Update user information request
    .addCase("updateUserInfoRequest", (state) => {
      state.loading = true;
    })
    // Update user information success
    .addCase("updateUserInfoSuccess", (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    // Update user information failed
    .addCase("updateUserInfoFailed", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
});
