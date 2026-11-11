import { createReducer } from "@reduxjs/toolkit";
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  EMPTY_CART,
  SET_CART,
  UPDATE_CART_QTY,
} from "../actions/cart";

const initialState = {
  cart: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

const cartReducer = createReducer(initialState, (builder) => {
  builder.addCase(SET_CART, (state, action) => {
    state.cart = Array.isArray(action.payload) ? action.payload : [];
  });

  builder.addCase(ADD_TO_CART, (state, action) => {
    const item = action.payload;
    if (!item || item.id === undefined) return;
    const existingItemIndex = state.cart.findIndex((i) => i.id === item.id);
    if (existingItemIndex !== -1) {
      state.cart[existingItemIndex].qty = item.qty || state.cart[existingItemIndex].qty + 1;
    } else {
      state.cart.push({ ...item, qty: item.qty || 1 });
    }
  });

  builder.addCase(UPDATE_CART_QTY, (state, action) => {
    const { productId, qty } = action.payload;
    const idx = state.cart.findIndex((i) => i.id === productId);
    if (idx !== -1) {
      if (qty <= 0) {
        state.cart.splice(idx, 1);
      } else {
        state.cart[idx].qty = qty;
      }
    }
  });

  builder.addCase(REMOVE_FROM_CART, (state, action) => {
    state.cart = state.cart.filter((i) => i.id !== action.payload);
  });

  builder.addCase(EMPTY_CART, (state) => {
    state.cart = [];
  });
});

export default cartReducer;
