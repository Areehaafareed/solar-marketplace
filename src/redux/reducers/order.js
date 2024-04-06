import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  orders: [],
};

const orderReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("getAllOrdersUserRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOrdersUserSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    })
    .addCase("getAllOrdersUserFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
});

export default orderReducer;
