import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { apiRequest, resolveAssetUrl } from "../../utils/api";

const ORDER_STATUSES = [
  "Processing",
  "Transferred to delivery partner",
  "Shipping",
  "Received",
  "On the way",
  "Delivered",
];

const REFUND_STATUSES = ["Processing refund", "Refund Success"];

const OrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await apiRequest(`/api/orders/${id}`, { role: "vendor" });
        setOrder(res.order);
        setStatus(res.order.orderStatus);
      } catch {
        // Fallback handled via Redux orders selector
      }
    };
    dispatch(getAllOrdersOfShop());
    loadOrder();
  }, [dispatch, id]);

  const data = order || (orders && orders.find((item) => item._id === id));

  useEffect(() => {
    if (data?.orderStatus && !status) {
      setStatus(data.orderStatus);
    }
  }, [data, status]);

  const handleStatusUpdate = async () => {
    if (!status) return;
    setUpdating(true);
    try {
      const res = await apiRequest(`/api/orders/${id}/status`, {
        method: "PUT",
        role: "vendor",
        body: { status },
      });
      setOrder(res.order);
      dispatch({ type: "updateOrderInList", payload: res.order });
      toast.success("Order status updated successfully!");
      navigate("/dashboard-orders");
    } catch (error) {
      toast.error(error.message || "Failed to update order status.");
    } finally {
      setUpdating(false);
    }
  };

  const isRefund =
    data?.orderStatus === "Processing refund" || data?.orderStatus === "Refund Success";

  const statusOptions = isRefund ? REFUND_STATUSES : ORDER_STATUSES;
  const currentIdx = statusOptions.indexOf(data?.orderStatus);
  const selectableStatuses = currentIdx >= 0 ? statusOptions.slice(currentIdx) : statusOptions;

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
        <Link to="/dashboard-orders">
          <div
            className={`${styles.button} !bg-[#fce1e6] !rounded-[4px] text-[#e94560] font-[600] !h-[45px] text-[18px]`}
          >
            Order List
          </div>
        </Link>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          Order ID: <span>#{data?._id}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Placed on: <span>{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      <br />
      <div className="space-y-4">
        {data?.cart?.map((item, index) => (
          <div className="w-full flex items-center bg-white p-3 rounded shadow-sm" key={index}>
            <img
              src={resolveAssetUrl(item.image_URL)}
              alt={item.name}
              className="w-[80px] h-[80px] object-cover rounded"
            />
            <div className="w-full pl-3">
              <h5 className="text-[18px] font-medium">{item.name}</h5>
              <h5 className="text-[16px] text-[#00000091]">
                US${item.discountPrice ?? item.discount_price} x {item.qty}
              </h5>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t w-full text-right mt-6">
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>US${data?.totalPrice}</strong>
        </h5>
      </div>

      <div className="w-full 800px:flex items-start mt-6 gap-6">
        <div className="w-full 800px:w-[60%] bg-white p-4 rounded shadow-sm">
          <h4 className="text-[18px] font-[600] mb-2">Customer & Shipping Address:</h4>
          <p className="text-[16px] font-medium">{data?.user?.name}</p>
          <p className="text-[15px] text-gray-600">{data?.user?.email}</p>
          {data?.shippingAddress && (
            <>
              <p className="pt-2 text-[16px]">
                {data.shippingAddress.address1} {data.shippingAddress.address2}
              </p>
              <p className="text-[16px]">
                {data.shippingAddress.city}, {data.shippingAddress.country} ({data.shippingAddress.zipCode})
              </p>
            </>
          )}
          {data?.user?.phoneNumber && (
            <p className="text-[16px] pt-1">Phone: {data.user.phoneNumber}</p>
          )}
        </div>

        <div className="w-full 800px:w-[40%] bg-white p-4 rounded shadow-sm mt-4 800px:mt-0">
          <h4 className="text-[18px] font-[600] mb-2">Payment Info:</h4>
          <p>Method: {data?.paymentInfo?.type || "N/A"}</p>
          <p>
            Status:{" "}
            <strong>
              {data?.paymentInfo?.status ? data.paymentInfo.status : "Not Paid"}
            </strong>
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="pt-3 text-[20px] font-[600]">Order Status:</h4>
        <select
          value={status || data?.orderStatus || ""}
          onChange={(e) => setStatus(e.target.value)}
          className="w-[260px] mt-2 border h-[40px] rounded-[5px] px-2 bg-white"
        >
          {selectableStatuses.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>

        <div>
          <button
            type="button"
            disabled={updating}
            className={`${styles.button} mt-5 !bg-[#FCE1E6] !rounded-[4px] text-[#E94560] font-[600] !h-[45px] text-[18px] disabled:opacity-60`}
            onClick={handleStatusUpdate}
          >
            {updating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
