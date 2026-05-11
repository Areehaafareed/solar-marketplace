import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  wishlist: localStorage.getItem("wishlistItems")
    ? JSON.parse(localStorage.getItem("wishlistItems"))
    : [],
};

const wishlistReducer = createReducer(initialState, (builder) => {
  builder.addCase("addToWishlist", (state, action) => {
    const item = action.payload;
    const existingItemIndex = state.wishlist.findIndex((i) => i.id === item.id);

    if (existingItemIndex !== -1) {
      // If item already exists, update its quantity instead of replacing it
      const updatedCart = [...state.wishlist];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].qty + 1,
      };

      return {
        ...state,
        wishlist: updatedCart,
      };
    } else {
      // If item doesn't exist, add it to the cart
      return {
        ...state,
        wishlist: [...state.wishlist, { ...item, qty: 1 }],
      };
    }
  });
  builder.addCase("removeFromWishlist", (state, action) => {
    return {
      ...state,
      wishlist: state.wishlist.filter((i) => i.id !== action.payload),
    };
  });
});

export default wishlistReducer;
