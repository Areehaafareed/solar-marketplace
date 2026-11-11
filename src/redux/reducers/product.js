import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  products: [],
  allProducts: [],
  packages: [],
  success: false,
  error: null,
  message: null,
};

export const productReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("getAllProductsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllProductsSuccess", (state, action) => {
      state.isLoading = false;
      state.allProducts = action.payload.products || [];
      state.packages = action.payload.packages || [];
      state.error = null;
    })
    .addCase("getAllProductsFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase("productCreateRequest", (state) => {
      state.isLoading = true;
      state.success = false;
      state.error = null;
    })
    .addCase("productCreateSuccess", (state, action) => {
      state.isLoading = false;
      state.products = [action.payload, ...(state.products || [])];
      if (action.payload.type === "package") {
        state.packages = [action.payload, ...(state.packages || [])];
      } else {
        state.allProducts = [action.payload, ...(state.allProducts || [])];
      }
      state.success = true;
      state.error = null;
    })
    .addCase("productCreateFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })
    .addCase("resetProductState", (state) => {
      state.success = false;
      state.error = null;
      state.message = null;
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
    })
    .addCase("getAllProductsShopRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllProductsShopSuccess", (state, action) => {
      state.isLoading = false;
      state.products = action.payload || [];
      state.error = null;
    })
    .addCase("getAllProductsShopFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase("deleteProductRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("deleteProductSuccess", (state, action) => {
      state.isLoading = false;
      state.products = (state.products || []).filter((p) => p.id !== action.payload.id);
      state.allProducts = (state.allProducts || []).filter((p) => p.id !== action.payload.id);
      state.packages = (state.packages || []).filter((p) => p.id !== action.payload.id);
      state.message = action.payload.message;
    })
    .addCase("deleteProductFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
});
