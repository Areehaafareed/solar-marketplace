import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  orders: [],
  error: null,
};

const orderReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("getAllOrdersUserRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOrdersUserSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload || [];
      state.error = null;
    })
    .addCase("getAllOrdersUserFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase("getAllOrdersShopRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOrdersShopSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload || [];
      state.error = null;
    })
    .addCase("getAllOrdersShopFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase("updateOrderInList", (state, action) => {
      const updated = action.payload;
      state.orders = (state.orders || []).map((o) =>
        o._id === updated._id || o.id === updated.id ? updated : o
      );
    });
});

export default orderReducer;
