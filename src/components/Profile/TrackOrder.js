import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import { useParams } from "react-router";

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    // Dispatch the action creator to fetch user's orders
    dispatch(getAllOrdersOfUser(), [dispatch]);
  }, []);
  const data = orders && orders.find((item) => item._id === id);
 
  return(
    <div className="w-full h-[80vh] flex justify-center items-center">
      <>
      {data && data?.orderStatus === "Processing" ? (
          <h1 className="text-[20px]">Your Order is processing in shop.</h1>
        ) : data?.orderStatus === "Transferred to delivery partner" ? (
          <h1 className="text-[20px]">
            Your Order is on the way for delivery partner.
          </h1>
        ) : data?.orderStatus === "shipped" ? (
          <h1 className="text-[20px]">
            Your Order is on the way with our delivery partner.
          </h1>
        ) : data?.orderStatus === "Received" ? (
          <h1 className="text-[20px]">
            Your Order is in your city. Our Delivery man will deliver it.
          </h1>
        ) : data?.orderStatus === "On the way" ? (
          <h1 className="text-[20px]">
            Our Delivery man is going to deliver your order.
          </h1>
        ) : data?.orderStatus === "Delivered" ? (
          <h1 className="text-[20px]">Your order is delivered!</h1>
        ) : data?.orderStatus === "Processing refund" ? (
          <h1 className="text-[20px]">Your refund is processing!</h1>
        ) : data?.orderStatus === "Refund Success" ? (
          <h1 className="text-[20px]">Your Refund is success!</h1>
        ) : null}
      </>
    </div>
  );




};

export default TrackOrder;
