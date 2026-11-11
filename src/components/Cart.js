import React from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import styles from "../styles/styles";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { emptyCart, removeFromCart, updateCartQty } from "../redux/actions/cart";
import { resolveAssetUrl } from "../utils/api";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = async (data) => {
    try {
      await dispatch(removeFromCart(data.id));
      toast.info("Item removed from cart.");
    } catch (error) {
      toast.error(error.message || "Failed to remove item.");
    }
  };

  const quantityChangeHandler = async (data, newQty) => {
    try {
      await dispatch(updateCartQty(data.id, newQty));
    } catch (error) {
      toast.error(error.message || "Failed to update quantity.");
    }
  };

  const emptyCartHandler = async () => {
    await dispatch(emptyCart());
    toast.success("Cart has been emptied!");
  };

  const totalPrice = (cart || [])
    .reduce((acc, item) => acc + Number(item.qty || 1) * Number(item.discount_price || 0), 0)
    .toFixed(2);

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-40">
      <div className="fixed top-0 right-0 h-full w-[85%] 800px:w-[28%] bg-white flex flex-col overflow-y-scroll justify-between shadow-lg">
        {!cart || cart.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center relative">
            <RxCross1
              size={25}
              className="cursor-pointer absolute top-5 right-5"
              onClick={() => setOpenCart(false)}
            />
            <h5 className="text-lg text-gray-600">Cart is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="w-full flex justify-between items-center p-4 border-b">
                <h5 className="text-[20px] font-[500]">My Cart</h5>
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />
              </div>

              <div className={`${styles.normalFlex} p-4`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[18px] font-[500]">
                  {cart.length} {cart.length === 1 ? "item" : "items"}
                </h5>
              </div>

              <div className="w-full border-t">
                {cart.map((item) => (
                  <CartSingle
                    key={item.id}
                    data={item}
                    quantityChangeHandler={quantityChangeHandler}
                    removeFromCartHandler={removeFromCartHandler}
                  />
                ))}
              </div>
            </div>

            <div className="p-4 border-t space-y-3">
              <Link to="/checkout" onClick={() => setOpenCart(false)}>
                <div className="h-[45px] flex items-center justify-center w-full bg-[#e44343] rounded-[5px] hover:bg-[#c93535]">
                  <h1 className="text-[#fff] text-[17px] font-[600]">
                    Checkout Now (US${totalPrice})
                  </h1>
                </div>
              </Link>

              <button
                type="button"
                className="h-[42px] flex items-center justify-center w-full bg-gray-800 rounded-[5px] hover:bg-gray-900"
                onClick={emptyCartHandler}
              >
                <span className="text-[#fff] text-[16px] font-[500]">Empty Cart</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const value = Number(data.qty || 1);
  const price = Number(data.discount_price || 0);
  const totalPrice = (price * value).toFixed(2);

  const increment = () => {
    if (data.stock !== undefined && data.stock < value + 1) {
      toast.error("Product stock limited!");
    } else {
      quantityChangeHandler(data, value + 1);
    }
  };

  const decrement = () => {
    if (value <= 1) return;
    quantityChangeHandler(data, value - 1);
  };

  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center justify-between gap-2">
        <div className="flex flex-col items-center">
          <div
            className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.normalFlex} justify-center cursor-pointer`}
            onClick={increment}
          >
            <HiPlus size={16} color="#fff" />
          </div>
          <span className="py-1 text-sm font-medium">{value}</span>
          <div
            className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={decrement}
          >
            <HiOutlineMinus size={14} color="#7d879c" />
          </div>
        </div>

        <img
          src={resolveAssetUrl(data.image_URL)}
          className="w-[75px] h-[75px] object-cover rounded-[5px]"
          alt={data.name}
        />

        <div className="flex-1 pl-2">
          <h1 className="text-sm font-medium text-gray-800">{data.name}</h1>
          <h4 className="font-[400] text-[13px] text-[#00000082]">
            ${price.toFixed(2)} x {value}
          </h4>
          <h4 className="font-[600] text-[15px] pt-[2px] text-[#d02222] font-Roboto">
            US${totalPrice}
          </h4>
        </div>

        <RxCross1
          className="cursor-pointer text-gray-500 hover:text-red-600"
          size={18}
          onClick={() => removeFromCartHandler(data)}
        />
      </div>
    </div>
  );
};

export default Cart;
