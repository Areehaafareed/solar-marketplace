import { apiRequest } from "../../utils/api";
import { fetchCart } from "./cart";
import { fetchWishlist } from "./wishlist";

export const loadUser = () => async (dispatch) => {
  const token = localStorage.getItem("customerToken");
  if (!token) {
    dispatch({ type: "LoadUserFail", payload: null });
    return;
  }

  try {
    dispatch({ type: "LoadUserRequest" });
    const data = await apiRequest("/api/auth/me", { role: "customer" });
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("email", data.user.email);
    localStorage.setItem("fullName", data.user.fullName);

    dispatch({
      type: "LoadUserSuccess",
      payload: { user: data.user, addresses: data.addresses || [] },
    });
    dispatch(fetchCart());
    dispatch(fetchWishlist());
  } catch (error) {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("email");
    localStorage.removeItem("fullName");
    dispatch({ type: "LoadUserFail", payload: error.message });
  }
};

export const loginSuccessAction = (data) => async (dispatch) => {
  localStorage.setItem("customerToken", data.token);
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("email", data.user.email);
  localStorage.setItem("fullName", data.user.fullName);

  dispatch({
    type: "LoadUserSuccess",
    payload: { user: data.user, addresses: [] },
  });
  dispatch(loadUser());
};

export const logoutUser = () => async (dispatch) => {
  localStorage.removeItem("customerToken");
  localStorage.removeItem("authToken");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("email");
  localStorage.removeItem("fullName");
  localStorage.removeItem("cartItems");
  localStorage.removeItem("wishlistItems");
  localStorage.removeItem("userOrders");

  dispatch({ type: "LogoutUserSuccess" });
  dispatch({ type: "EMPTY_CART" });
  dispatch({ type: "SET_WISHLIST", payload: [] });
  dispatch({ type: "getAllOrdersUserSuccess", payload: [] });
};

export const updateUserInformation = (fullName, phoneNumber) => async (dispatch) => {
  try {
    dispatch({ type: "updateUserInfoRequest" });
    const data = await apiRequest("/api/auth/profile", {
      method: "PUT",
      role: "customer",
      body: { fullName, phoneNumber },
    });
    localStorage.setItem("fullName", data.user.fullName);
    dispatch({ type: "updateUserInfoSuccess", payload: data.user });
    return data;
  } catch (error) {
    dispatch({ type: "updateUserInfoFailed", payload: error.message });
    throw error;
  }
};
