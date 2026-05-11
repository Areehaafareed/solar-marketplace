import { createReducer } from "@reduxjs/toolkit";
import { ADD_TO_CART, REMOVE_FROM_CART, EMPTY_CART } from "../actions/cart"; // Import action type constants

const initialState = {
  cart: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

const cartReducer = createReducer(initialState, (builder) => {
  builder.addCase(ADD_TO_CART, (state, action) => {
    const item = action.payload;
    const existingItemIndex = state.cart.findIndex((i) => i.id === item.id);
    const alreadyExists = existingItemIndex !== -1;

    if (alreadyExists) {
      state.cart[existingItemIndex].qty += 1;
    } else {
      state.cart.push({ ...item, qty: 1 });
    }
  });

  builder.addCase(REMOVE_FROM_CART, (state, action) => {
    state.cart = state.cart.filter((i) => i.id !== action.payload);
  });

  // case for emptying the cart
  builder.addCase(EMPTY_CART, (state) => {
    state.cart = [];
  });
});

export default cartReducer;
