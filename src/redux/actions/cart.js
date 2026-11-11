import { apiRequest } from "../../utils/api";

export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const EMPTY_CART = "EMPTY_CART";
export const SET_CART = "SET_CART";
export const UPDATE_CART_QTY = "UPDATE_CART_QTY";

function saveCartLocal(cart) {
  localStorage.setItem("cartItems", JSON.stringify(cart));
}

export const fetchCart = () => async (dispatch) => {
  const token = localStorage.getItem("customerToken");
  if (!token) return;
  try {
    const data = await apiRequest("/api/cart", { role: "customer" });
    dispatch({ type: SET_CART, payload: data.cart || [] });
    saveCartLocal(data.cart || []);
  } catch (error) {
    console.error("Failed to fetch cart:", error.message);
  }
};

export const addTocart = (productData, qty = 1) => async (dispatch, getState) => {
  const token = localStorage.getItem("customerToken");
  const itemQty = Math.max(1, Number(qty || productData?.qty || 1));

  if (token) {
    const data = await apiRequest("/api/cart", {
      method: "POST",
      role: "customer",
      body: { productId: productData.id, qty: itemQty },
    });
    dispatch({ type: SET_CART, payload: data.cart || [] });
    saveCartLocal(data.cart || []);
    return data.cart;
  }

  dispatch({
    type: ADD_TO_CART,
    payload: { ...productData, qty: itemQty },
  });
  saveCartLocal(getState().cart.cart);
  return productData;
};

export const updateCartQty = (productId, qty) => async (dispatch, getState) => {
  const token = localStorage.getItem("customerToken");
  if (token) {
    const data = await apiRequest(`/api/cart/${productId}`, {
      method: "PUT",
      role: "customer",
      body: { qty },
    });
    dispatch({ type: SET_CART, payload: data.cart || [] });
    saveCartLocal(data.cart || []);
    return data.cart;
  }

  dispatch({ type: UPDATE_CART_QTY, payload: { productId, qty } });
  saveCartLocal(getState().cart.cart);
};

export const removeFromCart = (data) => async (dispatch, getState) => {
  const productId = typeof data === "object" ? data.id : data;
  const token = localStorage.getItem("customerToken");
  if (token) {
    const res = await apiRequest(`/api/cart/${productId}`, {
      method: "DELETE",
      role: "customer",
    });
    dispatch({ type: SET_CART, payload: res.cart || [] });
    saveCartLocal(res.cart || []);
    return data;
  }

  dispatch({ type: REMOVE_FROM_CART, payload: productId });
  saveCartLocal(getState().cart.cart);
  return data;
};

export const emptyCart = () => async (dispatch) => {
  const token = localStorage.getItem("customerToken");
  if (token) {
    try {
      await apiRequest("/api/cart", { method: "DELETE", role: "customer" });
    } catch (error) {
      console.error("Failed to empty cart on backend:", error.message);
    }
  }
  dispatch({ type: EMPTY_CART });
  localStorage.removeItem("cartItems");
};
