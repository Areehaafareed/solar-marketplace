// Action Types
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const EMPTY_CART = 'EMPTY_CART';

// add to cart
export const addTocart = (data, userEmail) => async (dispatch, getState) => {
  // Dispatch the action to add the item to the cart in Redux store
  dispatch({
    type: 'ADD_TO_CART',
    payload: { data, userEmail }
  });

  // Save the updated cart items to localStorage
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));

  return data; // Return the added item
};

// remove from cart
export const removeFromCart = (data) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_FROM_CART, // Use the defined action type
    payload: data.id,
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  return data;
};

// empty cart
export const emptyCart = () => async (dispatch, getState) => {
  dispatch({
    type: EMPTY_CART,
  });

  localStorage.removeItem("cartItems");
};
