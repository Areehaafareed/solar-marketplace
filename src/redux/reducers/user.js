import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: Boolean(localStorage.getItem("customerToken")),
  loading: false,
  user: null,
  addresses: [],
  error: null,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("LoadUserRequest", (state) => {
      state.loading = true;
    })
    .addCase("LoadUserSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.addresses = action.payload.addresses || [];
      state.error = null;
    })
    .addCase("LoadUserFail", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.addresses = [];
      state.error = action.payload || null;
    })
    .addCase("LogoutUserSuccess", (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.addresses = [];
      state.error = null;
    })
    .addCase("UpdateAddressesSuccess", (state, action) => {
      state.addresses = action.payload || [];
    })
    .addCase("updateUserInfoRequest", (state) => {
      state.loading = true;
    })
    .addCase("updateUserInfoSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    })
    .addCase("updateUserInfoFailed", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
});
