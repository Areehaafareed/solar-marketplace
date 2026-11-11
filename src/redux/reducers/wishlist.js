import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  wishlist: localStorage.getItem("wishlistItems")
    ? JSON.parse(localStorage.getItem("wishlistItems"))
    : [],
};

const wishlistReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("SET_WISHLIST", (state, action) => {
      state.wishlist = Array.isArray(action.payload) ? action.payload : [];
    })
    .addCase("addToWishlist", (state, action) => {
      const item = action.payload;
      if (!item || item.id === undefined) return;
      const exists = state.wishlist.some((i) => i.id === item.id);
      if (!exists) {
        state.wishlist.push({ ...item, qty: 1 });
      }
    })
    .addCase("removeFromWishlist", (state, action) => {
      state.wishlist = state.wishlist.filter((i) => i.id !== action.payload);
    });
});

export default wishlistReducer;
