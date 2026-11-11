import React, { useEffect, useState } from "react";
import styles from "../styles/styles";
import { RxCross1 } from "react-icons/rx";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { apiRequest } from "../utils/api";
import { emptyCart } from "../redux/actions/cart";
import { getAllProducts } from "../redux/actions/product";

const Payment = () => {
  const [orderData, setOrderData] = useState(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("latestOrder") || "null");
    if (!stored || !stored.cart || stored.cart.length === 0) {
      toast.info("Please complete your checkout details first.");
      navigate("/checkout");
      return;
    }
    setOrderData(stored);
  }, [navigate]);

  const placeOrderOnBackend = async (paymentInfo) => {
    if (!orderData || submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        cart: orderData.cart,
        shippingAddress: orderData.shippingAddress,
        paymentInfo,
        subTotalPrice: orderData.subTotalPrice,
        shipping: orderData.shipping,
        discountPrice: orderData.discountPrice || 0,
        totalPrice: orderData.totalPrice,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
      };

      const res = await apiRequest("/api/orders", {
        method: "POST",
        role: "customer",
        body: payload,
      });

      localStorage.setItem("latestOrder", JSON.stringify(res.order));
      await dispatch(emptyCart());
      dispatch(getAllProducts());
      toast.success("Order placed successfully!");
      navigate("/order/success");
    } catch (error) {
      toast.error(error.message || "Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: "Energy Matrix Solar Order",
          amount: {
            currency_code: "USD",
            value: String(orderData?.totalPrice || "10.00"),
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
    });
  };

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;
      if (payer) {
        setOpen(false);
        placeOrderOnBackend({
          id: payer.payer_id,
          status: "Succeeded",
          type: "PayPal",
        });
      }
    });
  };

  const cardPaymentHandler = async (e, cardDetails) => {
    e.preventDefault();
    const digits = cardDetails.cardNumber.replace(/\s+/g, "");
    if (!cardDetails.name.trim() || digits.length < 12 || !cardDetails.expiry || cardDetails.cvv.length < 3) {
      toast.error("Please enter valid card details.");
      return;
    }
    await placeOrderOnBackend({
      id: `CARD-${digits.slice(-4)}`,
      status: "Succeeded",
      type: "Credit/Debit Card",
    });
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();
    await placeOrderOnBackend({
      status: "Pending",
      type: "Cash On Delivery",
    });
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex gap-6">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo
            open={open}
            setOpen={setOpen}
            onApprove={onApprove}
            createOrder={createOrder}
            cardPaymentHandler={cardPaymentHandler}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
            submitting={submitting}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({
  open,
  setOpen,
  onApprove,
  createOrder,
  cardPaymentHandler,
  cashOnDeliveryHandler,
  submitting,
}) => {
  const [select, setSelect] = useState(1);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8 shadow-sm">
      {/* Card Payment */}
      <div>
        <div
          className="flex w-full pb-5 border-b mb-2 cursor-pointer"
          onClick={() => setSelect(1)}
        >
          <div className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center">
            {select === 1 ? (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
            Pay with Debit / Credit card
          </h4>
        </div>

        {select === 1 && (
          <div className="w-full flex border-b pb-5">
            <form
              className="w-full"
              onSubmit={(e) =>
                cardPaymentHandler(e, { name: cardName, cardNumber, expiry, cvv })
              }
            >
              <div className="w-full flex pb-3 gap-3">
                <div className="w-[50%]">
                  <label className="block pb-2">Name On Card</label>
                  <input
                    required
                    type="text"
                    placeholder="John Doe"
                    className={`${styles.input} text-[#444]`}
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>
                <div className="w-[50%]">
                  <label className="block pb-2">Exp Date (MM/YY)</label>
                  <input
                    required
                    type="text"
                    placeholder="08/28"
                    maxLength={5}
                    className={`${styles.input}`}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full flex pb-3 gap-3">
                <div className="w-[50%]">
                  <label className="block pb-2">Card Number</label>
                  <input
                    required
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    className={`${styles.input}`}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div className="w-[50%]">
                  <label className="block pb-2">CVV</label>
                  <input
                    required
                    type="password"
                    placeholder="123"
                    maxLength={4}
                    className={`${styles.input}`}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600] disabled:opacity-60`}
              >
                {submitting ? "Processing..." : "Pay & Place Order"}
              </button>
            </form>
          </div>
        )}
      </div>

      <br />
      {/* PayPal */}
      <div>
        <div
          className="flex w-full pb-5 border-b mb-2 cursor-pointer"
          onClick={() => setSelect(2)}
        >
          <div className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center">
            {select === 2 ? (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
            Pay with PayPal
          </h4>
        </div>

        {select === 2 && (
          <div className="w-full flex border-b pb-5">
            <div
              className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
              onClick={() => setOpen(true)}
            >
              Pay Now
            </div>
            {open && (
              <div className="w-full fixed top-0 left-0 bg-[#00000039] h-screen flex items-center justify-center z-[99999]">
                <div className="w-[90%] 800px:w-[40%] max-h-[80vh] bg-white rounded-[5px] shadow flex flex-col justify-center p-8 relative overflow-y-scroll">
                  <RxCross1
                    size={28}
                    className="cursor-pointer absolute top-3 right-3"
                    onClick={() => setOpen(false)}
                  />
                  <PayPalScriptProvider
                    options={{
                      "client-id":
                        "Aczac4Ry9_QA1t4c7TKH9UusH3RTe6onyICPoCToHG10kjlNdI-qwobbW9JAHzaRQwFMn2-k660853jn",
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      onApprove={onApprove}
                      createOrder={createOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <br />
      {/* Cash on Delivery */}
      <div>
        <div
          className="flex w-full pb-5 border-b mb-2 cursor-pointer"
          onClick={() => setSelect(3)}
        >
          <div className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center">
            {select === 3 ? (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
            Cash on Delivery
          </h4>
        </div>

        {select === 3 && (
          <div className="w-full flex">
            <form className="w-full" onSubmit={cashOnDeliveryHandler}>
              <button
                type="submit"
                disabled={submitting}
                className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600] disabled:opacity-60`}
              >
                {submitting ? "Placing Order..." : "Confirm Order"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  const shipping = Number(orderData?.shipping || 0).toFixed(2);
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8 shadow-sm">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Subtotal:</h3>
        <h5 className="text-[18px] font-[600]">${orderData?.subTotalPrice || 0}</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Shipping:</h3>
        <h5 className="text-[18px] font-[600]">${shipping}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">
          {orderData?.discountPrice ? `-$${orderData.discountPrice}` : "$0.00"}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">
        ${orderData?.totalPrice || 0}
      </h5>
    </div>
  );
};

export default Payment;
