import { apiRequest } from "../../utils/api";

export const getAllOrdersOfUser = () => async (dispatch) => {
  const token = localStorage.getItem("customerToken");
  if (!token) {
    dispatch({ type: "getAllOrdersUserSuccess", payload: [] });
    return;
  }

  try {
    dispatch({ type: "getAllOrdersUserRequest" });
    const data = await apiRequest("/api/orders/user", { role: "customer" });
    dispatch({
      type: "getAllOrdersUserSuccess",
      payload: data.orders || [],
    });
  } catch (error) {
    dispatch({
      type: "getAllOrdersUserFailed",
      payload: error.message || "Failed to load orders.",
    });
  }
};

export const getAllOrdersOfShop = () => async (dispatch) => {
  const token = localStorage.getItem("vendorToken");
  if (!token) {
    dispatch({ type: "getAllOrdersShopSuccess", payload: [] });
    return;
  }

  try {
    dispatch({ type: "getAllOrdersShopRequest" });
    const data = await apiRequest("/api/orders/vendor", { role: "vendor" });
    dispatch({
      type: "getAllOrdersShopSuccess",
      payload: data.orders || [],
    });
  } catch (error) {
    dispatch({
      type: "getAllOrdersShopFailed",
      payload: error.message || "Failed to load shop orders.",
    });
  }
};
