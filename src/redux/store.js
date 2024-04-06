import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "./reducers/cart";
import wishlistReducer from "./reducers/wishlist";
import { userReducer } from "./reducers/user";
import orderReducer from "./reducers/order";
import { sellerReducer } from "./reducers/seller";

const Store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    user: userReducer,
    order: orderReducer,
    seller: sellerReducer,
  },
});
export default Store;
