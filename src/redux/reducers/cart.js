import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  cart: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

const cartReducer = createReducer(initialState, (builder) => {
  builder.addCase("addToCart", (state, action) => {
    const item = action.payload;
    const existingItemIndex = state.cart.findIndex((i) => i.id === item.id);
    const alreadyExists = existingItemIndex !== -1;

    if (alreadyExists) {
      state.cart[existingItemIndex].qty += 1;
    } else {
      state.cart.push({ ...item, qty: 1 });
    }
  });

  builder.addCase("removeFromCart", (state, action) => {
    return {
      ...state,
      cart: state.cart.filter((i) => i.id !== action.payload),
    };
  });
});

export default cartReducer;
