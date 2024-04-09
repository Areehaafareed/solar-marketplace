// get all orders of user

export const getAllOrdersOfUser = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOrdersUserRequest",
    });

    // Use the dummy data directly

    const orders = [
      {
        _id: "123ab45",
        orderItems: [
          {
            name: "High Solar Panel",
          },
        ],
        image_URL: "/Assets/solar4.jpg",
        totalPrice: 1400,
        orderStatus: "processing",
      },
      {
        _id: "678cd90",
        orderItems: [
          {
            name: "Solar Battery",
          },
          {
            name: "Solar Charger",
          },
        ],
        totalPrice: 800,
        orderStatus: "shipped",
      },
      {
        _id: "456ef12",
        orderItems: [
          {
            name: "Solar Inverter",
          },
        ],
        totalPrice: 600,
        orderStatus: "delivered",
      },
      // Additional orders
      {
        _id: "789gh34",
        orderItems: [
          {
            name: "Solar Panel Mounting Kit",
          },
        ],
        totalPrice: 200,
        orderStatus: "processing",
      },
      {
        _id: "901ij56",
        orderItems: [
          {
            name: "Solar Water Heater",
          },
        ],
        totalPrice: 1200,
        orderStatus: "processing",
      },
      {
        _id: "234kl78",
        orderItems: [
          {
            name: "Solar Lights",
          },
          {
            name: "Solar Fan",
          },
        ],
        totalPrice: 500,
        orderStatus: "shipped",
      },
    ];

    dispatch({
      type: "getAllOrdersUserSuccess",
      payload: orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrdersUserFailed",
      payload: error.message,
    });
  }
};

// get all orders of shop

export const getAllOrdersOfShop = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOrdersShopRequest",
    });

    // Use the dummy data directly

    const orders = [
      {
        _id: "123ab45",
        orderItems: [
          {
            name: "High Solar Panel",
          },
        ],
        image_URL: "/Assets/solar4.jpg",
        totalPrice: 1400,
        orderStatus: "processing",
        qty: 3,
      },
      {
        _id: "678cd90",
        orderItems: [
          {
            name: "Solar Battery",
          },
        ],
        qty: 6,
        totalPrice: 800,
        orderStatus: "shipped",
      },
      {
        _id: "456ef12",
        orderItems: [
          {
            name: "Solar Inverter",
          },
        ],
        totalPrice: 600,
        qty: 12,
        orderStatus: "delivered",
      },
      // Additional orders
      {
        _id: "789gh34",
        orderItems: [
          {
            name: "Solar Panel Mounting Kit",
          },
        ],
        totalPrice: 200,
        qty: 7,
        orderStatus: "processing",
      },
      {
        _id: "901ij56",
        orderItems: [
          {
            name: "Solar Water Heater",
          },
        ],
        totalPrice: 1200,
        qty: 3,
        orderStatus: "processing",
      },
      {
        _id: "234kl78",
        orderItems: [
          {
            name: "Solar Lights",
          },
        ],
        qty: 1,
        totalPrice: 500,
        orderStatus: "shipped",
      },
    ];

    dispatch({
      type: "getAllOrdersShopSuccess",
      payload: orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrdersShopFailed",
      payload: error.message,
    });
  }
};
