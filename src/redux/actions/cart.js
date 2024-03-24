// // add to cart
// export const addToCart = (data) => async (dispatch, getState) => {
//   dispatch({
//     type: "addToCart",
//     payload: data,
//   });

//   localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
//   return data;
// };

// // remove from cart
// export const removeFromCart = (data) => async (dispatch, getState) => {
//   dispatch({
//     type: "removeFromCart",
//     payload: data._id,
//   });
//   localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
//   return data;
// };

// add to cart
export const addTocart = (data) => async (dispatch, getState) => {
  dispatch({
    type: "addToCart", // Use the correct action type
    payload: data,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  return data;
};

// remove from cart
export const removeFromCart = (data) => async (dispatch, getState) => {
  dispatch({
    type: "removeFromCart", // Use the correct action type
    payload: data,
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  return data;
};
