import { BsFillBagFill } from "react-icons/bs";
import styles from "../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { getAllProducts } from "../redux/actions/product";
import { toast } from "react-toastify";
import { apiRequest, resolveAssetUrl } from "../utils/api";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [order, setOrder] = useState(null);
  const { id } = useParams();

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

  const reviewHandler = async () => {
    if (!selectedItem?.productId) {
      toast.error("Cannot review this item.");
      return;
    }
    try {
      await apiRequest(`/api/products/${selectedItem.productId}/reviews`, {
        method: "POST",
        role: "customer",
        body: {
          rating,
          comment,
          orderItemId: selectedItem.id,
        },
      });
      toast.success("Thank you for your review!");
      setOpen(false);
      setComment("");
      setRating(5);
      dispatch(getAllProducts());
      const res = await apiRequest(`/api/orders/${id}`, { role: "customer" });
      setOrder(res.order);
    } catch (error) {
      toast.error(error.message || "Failed to submit review.");
    }
  };

  const refundHandler = async (orderId) => {
    try {
      const res = await apiRequest(`/api/orders/${orderId}/refund`, {
        method: "POST",
        role: "customer",
      });
      setOrder(res.order);
      dispatch({ type: "updateOrderInList", payload: res.order });
      toast.success("Refund request submitted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to start refund process.");
    }
  };

  const firstVendorId = data?.orderItems?.[0]?.vendorId || 1;
  const firstVendorName = data?.orderItems?.[0]?.vendorName || "Vendor";

  return (
    <div className={`py-6 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
        <Link to="/profile" className="text-blue-600 hover:underline">
          Back to Profile
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
        {data?.orderItems?.map((item, index) => (
          <div className="w-full flex items-center justify-between bg-white p-3 rounded shadow-sm" key={index}>
            <div className="flex items-center">
              <img
                src={resolveAssetUrl(item.image_URL)}
                alt={item.name}
                className="w-[80px] h-[80px] object-cover rounded"
              />
              <div>
                <h5 className="pl-3 text-[18px] font-medium">{item.name}</h5>
                <h5 className="pl-3 text-[16px] text-[#00000091]">
                  US${item.discount_price} x {item.qty}
                </h5>
              </div>
            </div>
            {!item.isReviewed && data?.orderStatus === "Delivered" ? (
              <div
                className={`${styles.button} text-[#fff]`}
                onClick={() => {
                  setSelectedItem(item);
                  setOpen(true);
                }}
              >
                Write a review
              </div>
            ) : item.isReviewed ? (
              <span className="text-sm text-green-600 font-medium px-3">Reviewed</span>
            ) : null}
          </div>
        ))}
      </div>

      {open && (
        <div className="w-full fixed top-0 left-0 h-screen bg-[#0005] z-50 flex items-center justify-center">
          <div className="w-[90%] md:w-[50%] h-min bg-[#fff] shadow rounded-md p-5">
            <div className="w-full flex justify-end">
              <RxCross1 size={28} onClick={() => setOpen(false)} className="cursor-pointer" />
            </div>
            <h2 className="text-[26px] font-[500] font-Poppins text-center">Give a Review</h2>
            <div className="w-full flex items-center my-4">
              <img
                src={resolveAssetUrl(selectedItem?.image_URL)}
                alt=""
                className="w-[70px] h-[70px] object-cover rounded"
              />
              <div>
                <div className="pl-3 text-[18px] font-medium">{selectedItem?.name}</div>
                <h4 className="pl-3 text-[16px] text-gray-600">
                  US${selectedItem?.discount_price} x {selectedItem?.qty}
                </h4>
              </div>
            </div>

            <h5 className="text-[18px] font-[500]">
              Give a Rating <span className="text-red-500">*</span>
            </h5>
            <div className="flex w-full pt-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                )
              )}
            </div>

            <label className="block text-[18px] font-[500]">Write a comment</label>
            <textarea
              cols="20"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was your product? Write your experience!"
              className="mt-2 w-full border p-2 outline-none rounded"
            ></textarea>

            <div className={`${styles.button} text-white text-[18px] mt-4`} onClick={reviewHandler}>
              Submit
            </div>
          </div>
        </div>
      )}

      <div className="border-t w-full text-right mt-6">
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>US${data?.totalPrice}</strong>
        </h5>
      </div>

      <div className="w-full 800px:flex items-start mt-6 gap-6">
        {data?.shippingAddress && (
          <div className="w-full 800px:w-[60%] bg-white p-4 rounded shadow-sm">
            <h4 className="text-[18px] font-[600] mb-2">Shipping Address:</h4>
            <p className="text-[16px]">
              {data.shippingAddress.address1} {data.shippingAddress.address2}
            </p>
            <p className="text-[16px]">
              {data.shippingAddress.city}, {data.shippingAddress.country} ({data.shippingAddress.zipCode})
            </p>
            <p className="text-[16px]">{data.user?.phoneNumber}</p>
          </div>
        )}

        <div className="w-full 800px:w-[40%] bg-white p-4 rounded shadow-sm mt-4 800px:mt-0">
          <h4 className="text-[18px] font-[600] mb-2">Order & Payment Info:</h4>
          <p>Order Status: <strong>{data?.orderStatus}</strong></p>
          <p>Payment Method: {data?.paymentInfo?.type || "N/A"}</p>
          <p>Payment Status: {data?.paymentInfo?.status || "Pending"}</p>

          {data?.orderStatus === "Delivered" && (
            <div
              className={`${styles.button} text-white mt-4`}
              onClick={() => refundHandler(data._id)}
            >
              Request a Refund
            </div>
          )}
        </div>
      </div>

      <div
        className={`${styles.button} text-white mt-6`}
        onClick={() =>
          navigate(`/inbox?vendorId=${firstVendorId}&vendorName=${encodeURIComponent(firstVendorName)}`)
        }
      >
        Send Message
      </div>
    </div>
  );
};

export default UserOrderDetails;
