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
        qty: 3,
        createdAt: "2022-04-09",
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
        orderStatus: "Processing refund",
        createdAt: "2022-03-01",
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
        orderStatus: "Delivered",
        createdAt: "2022-04-01",
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
        orderStatus: "Processing",
        createdAt: "2022-08-05",
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
        orderStatus: "Delivered",
        createdAt: "2022-06-08",
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
        createdAt: "2022-04-01",
      },
    ];
    // Store the orders data in localStorage
    localStorage.setItem("userOrders", JSON.stringify(orders));

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
        createdAt: "2022-04-09",
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
        orderStatus: "Processing refund",
        createdAt: "2022-03-01",
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
        orderStatus: "Delivered",
        createdAt: "2022-04-01",
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
        orderStatus: "Processing",
        createdAt: "2022-08-05",
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
        orderStatus: "Delivered",
        createdAt: "2022-06-08",
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
        createdAt: "2022-04-01",
      },
    ];
    // Store the orders data in localStorage
    localStorage.setItem("userOrders", JSON.stringify(orders));

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
