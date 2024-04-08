// Action to create a product

export const createProduct = (newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "productCreateRequest",
    });

    // Simulate a delay to mimic the time taken for an HTTP request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock response data for the created product
    const createdProduct = {
      id: Math.random().toString(36).substr(2, 9), // Generate a random ID
      ...Object.fromEntries(newForm.entries()),
    };

    // Dispatch an action to update the Redux store with the created product
    dispatch({
      type: "productCreateSuccess",
      payload: createdProduct.product,
    });

    // Store the created product data in local storage
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    localStorage.setItem(
      "products",
      JSON.stringify([...storedProducts, createdProduct])
    );
  } catch (error) {
    dispatch({
      type: "productCreateFail",
      payload: error.response
        ? error.response.data.message
        : "Failed to create product.",
    });
  }
};

export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsShopRequest",
    });

    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];

    setTimeout(() => {
      dispatch({
        type: "getAllProductsShopSuccess",
        payload: storedProducts,
      });
    }, 1000);
  } catch (error) {
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.message,
    });
  }
};

// delete product of a shop

export const deleteProduct = (id) => (dispatch) => {
  try {
    dispatch({
      type: "deleteProductRequest",
    });

    // Simulate a delay to mimic an asynchronous operation
    setTimeout(() => {
      // Retrieve products from local storage
      const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
      // Filter out the product to be deleted
      const updatedProducts = storedProducts.filter(
        (product) => product.id !== id
      );
      // Update local storage with the updated product list
      localStorage.setItem("products", JSON.stringify(updatedProducts));

      dispatch({
        type: "deleteProductSuccess",
        payload: "Product deleted successfully.",
      });
    }, 1000); // Adjust the delay as needed
  } catch (error) {
    dispatch({
      type: "deleteProductFailed",
      payload: error.message || "Failed to delete product.",
    });
  }
};
