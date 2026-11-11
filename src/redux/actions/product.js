import { apiRequest } from "../../utils/api";

export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllProductsRequest" });
    const data = await apiRequest("/api/products?type=all");
    const list = data.products || [];
    dispatch({
      type: "getAllProductsSuccess",
      payload: {
        products: list.filter((p) => p.type !== "package"),
        packages: list.filter((p) => p.type === "package"),
      },
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsFailed",
      payload: error.message || "Failed to load products.",
    });
  }
};

export const createProduct = (newForm) => async (dispatch) => {
  try {
    dispatch({ type: "productCreateRequest" });
    const data = await apiRequest("/api/products", {
      method: "POST",
      role: "vendor",
      body: newForm,
    });
    dispatch({
      type: "productCreateSuccess",
      payload: data.product,
    });
    return data.product;
  } catch (error) {
    dispatch({
      type: "productCreateFail",
      payload: error.message || "Failed to create product.",
    });
    throw error;
  }
};

export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({ type: "getAllProductsShopRequest" });
    const query = id ? `?vendorId=${id}&type=all` : "?type=all";
    const data = await apiRequest(`/api/products${query}`);
    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.products || [],
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.message || "Failed to fetch shop products.",
    });
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteProductRequest" });
    const data = await apiRequest(`/api/products/${id}`, {
      method: "DELETE",
      role: "vendor",
    });
    dispatch({
      type: "deleteProductSuccess",
      payload: { id, message: data.message || "Product deleted successfully." },
    });
  } catch (error) {
    dispatch({
      type: "deleteProductFailed",
      payload: error.message || "Failed to delete product.",
    });
  }
};
