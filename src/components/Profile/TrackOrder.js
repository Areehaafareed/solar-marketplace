import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import { useParams, Link } from "react-router-dom";
import { apiRequest } from "../../utils/api";

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await apiRequest(`/api/orders/${id}`, { role: "customer" });
        setOrder(res.order);
      } catch {
        // Fallback handled via Redux orders selector
      }
    };
    dispatch(getAllOrdersOfUser());
    loadOrder();
  }, [dispatch, id]);

  const data = order || (orders && orders.find((item) => item._id === id));

  const statusMessages = {
    Processing: "Your order is processing in the shop.",
    "Transferred to delivery partner": "Your order has been handed over to our delivery partner.",
    Shipping: "Your order is currently shipping.",
    shipped: "Your order is on the way with our delivery partner.",
    Received: "Your order has arrived in your city. Our delivery agent will deliver it soon.",
    "On the way": "Our delivery agent is on the way to your address.",
    Delivered: "Your order has been delivered!",
    "Processing refund": "Your refund request is being processed.",
    "Refund Success": "Your refund has been completed successfully!",
  };

  return (
    <div className="w-full min-h-[60vh] flex flex-col justify-center items-center p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full text-center">
        <h2 className="text-2xl font-bold mb-2">Order Tracking</h2>
        <p className="text-sm text-gray-500 mb-6">Order ID: #{id}</p>
        {data ? (
          <>
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-[#051d40] font-semibold mb-4">
              {data.orderStatus}
            </div>
            <h1 className="text-[20px] text-gray-800">
              {statusMessages[data.orderStatus] || `Current status: ${data.orderStatus}`}
            </h1>
          </>
        ) : (
          <p className="text-gray-500">Loading order tracking details...</p>
        )}
        <div className="mt-8">
          <Link to="/profile" className="text-blue-600 hover:underline">
            Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
