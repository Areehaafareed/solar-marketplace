import { apiRequest } from "../../utils/api";

export const fetchWishlist = () => async (dispatch) => {
  const token = localStorage.getItem("customerToken");
  if (!token) return;
  try {
    const data = await apiRequest("/api/wishlist", { role: "customer" });
    dispatch({ type: "SET_WISHLIST", payload: data.wishlist || [] });
    localStorage.setItem("wishlistItems", JSON.stringify(data.wishlist || []));
  } catch (error) {
    console.error("Failed to fetch wishlist:", error.message);
  }
};

export const addToWishlist = (data) => async (dispatch, getState) => {
  dispatch({ type: "addToWishlist", payload: data });
  localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));

  const token = localStorage.getItem("customerToken");
  if (token) {
    try {
      const res = await apiRequest("/api/wishlist", {
        method: "POST",
        role: "customer",
        body: { productId: data.id },
      });
      dispatch({ type: "SET_WISHLIST", payload: res.wishlist || [] });
      localStorage.setItem("wishlistItems", JSON.stringify(res.wishlist || []));
    } catch (error) {
      console.error("Wishlist sync error:", error.message);
    }
  }
  return data;
};

export const removeFromWishlist = (data) => async (dispatch, getState) => {
  const productId = typeof data === "object" ? data.id : data;
  dispatch({ type: "removeFromWishlist", payload: productId });
  localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));

  const token = localStorage.getItem("customerToken");
  if (token) {
    try {
      const res = await apiRequest(`/api/wishlist/${productId}`, {
        method: "DELETE",
        role: "customer",
      });
      dispatch({ type: "SET_WISHLIST", payload: res.wishlist || [] });
      localStorage.setItem("wishlistItems", JSON.stringify(res.wishlist || []));
    } catch (error) {
      console.error("Wishlist delete sync error:", error.message);
    }
  }
  return data;
};
