import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
    products: [],
};

export const productReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("productCreateRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("productCreateSuccess", (state, action) => {
            state.isLoading = false;
            state.products = action.payload;
            state.success = true;
        })
        .addCase("productCreateFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })
        .addCase("clearErrors", (state) => {
            state.error = null;
        })

        // get all product of shop

        .addCase("getAllProductsShopRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("getAllProductsShopSuccess", (state, action) => {
            state.isLoading = false;
            state.products = action.payload;
            state.error = null;
        })
        .addCase("getAllProductsShopFailed", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        // delete
        .addCase("deleteProductRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("deleteProductSuccess", (state, action) => {
            state.isLoading = false;
            state.message = action.payload;
        })
        .addCase("deleteProductFailed", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
});
