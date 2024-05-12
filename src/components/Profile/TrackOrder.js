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
  console.log(data);
  return <div></div>;
};

export default TrackOrder;
