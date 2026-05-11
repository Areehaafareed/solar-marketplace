import React, { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import styles from "../styles/styles";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { backendURL } from "../config";

const Cart = ({ setOpenCart }) => {
  const [cart, setCart] = useState([]);
  const userEmail = localStorage.getItem('userEmail'); // Retrieve user email from localStorage

  // Load cart items from local storage on component mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) ?? [];
    setCart(storedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const removeFromCartHandler = (data) => {
    const updatedCart = cart.filter(item => item !== data);
    updateCart(updatedCart);
  };

  const quantityChangeHandler = (data) => {
    // Check if the item is already in the cart
    const itemIndex = cart.findIndex(item => item.data.id === data.data.id);

    if (itemIndex !== -1) {
      // If the item is already in the cart, update its quantity
      const updatedCart = [...cart];
      updatedCart[itemIndex].qty = data.qty;
      updateCart(updatedCart);
    } else {
      // If the item is not in the cart, add it
      const updatedCart = [...cart, data];
      updateCart(updatedCart);
    }

    console.log("Request payload:", {
      email: userEmail,
      item: data
    });

    const addToCartURL = `${backendURL}/add-to-cart`;

    try {
      fetch(addToCartURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userEmail,
          item: data // Pass the entire data object
        })
      })
        .then(response => response.json())
        .then(responseData => {
          console.log(responseData); // Log the response from the backend
        })
        .catch(error => {
          console.error('Error adding item to cart:', error);
          // Handle error, show toast message, etc.
        });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      // Handle error, show toast message, etc.
    }
  };

  const emptyCartHandler = () => {
    setCart([]);
    localStorage.removeItem("cartItems");
    toast.success("Cart has been emptied!");
  };

  // Calculate total price
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discount_price,
    0
  ).toFixed(2);

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
        {cart.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5>Cart is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex  justify-center">
                <h5 className=" text-[20px] font-[500]">My Cart</h5>
              </div>

              <div className="w-full flex  justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />
              </div>
              {/* item length */}
              <div className={`${styles.normalFlex} p-4`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {cart.length} items
                </h5>
              </div>

              {/* cart Single Items */}
              <br />
              <div className="w-full border-t">
                {cart.map((item, index) => (
                  <CartSingle
                    key={index}
                    data={item}
                    quantityChangeHandler={quantityChangeHandler}
                    removeFromCartHandler={removeFromCartHandler}
                  />
                ))}
              </div>
            </div>

            <div className="px-5 mb-3">
              {/* checkout buttons */}
              <Link to="/checkout">
                <div
                  className={`h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px]`}
                >
                  <h1 className="text-[#fff] text-[18px] font-[600]">
                    Checkout Now (USD${totalPrice})
                  </h1>
                </div>
              </Link>
            </div>

            {/* Empty Cart button */}
            <div className="px-5 mb-3">
              <button
                className={`h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px]`}
                onClick={emptyCartHandler}
              >
                <h1 className="text-[#fff] text-[18px] font-[600]">
                  Empty Cart
                </h1>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = (data.discount_price * value).toFixed(2);

  const increment = () => {
    if (data.stock < value + 1) {
      toast.error("Product stock limited!");
    } else {
      const newValue = value + 1;
      const updateCartData = { ...data, qty: newValue };
      quantityChangeHandler(updateCartData);
      setValue(newValue);
    }
  };

  const decrement = () => {
    if (value === 1) {
      return;
    }
    const newValue = value - 1;
    const updateCartData = { ...data, qty: newValue };
    quantityChangeHandler(updateCartData);
    setValue(newValue);
  };

  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <div>
          <div
            className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.normalFlex} justify-center cursor-pointer`}
            onClick={() => increment(data)}
          >
            <HiPlus size={18} color="#fff" />
          </div>
          <span className="pl-[10px]">{value}</span>
          <div
            className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={() => decrement(data.qty)}
          >
            <HiOutlineMinus size={16} color="#7d879c" />
          </div>
        </div>

        <img
          src={data.image_URL}
          className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
          alt=""
        />
        <div className="pl-[5px]">
          <h1> ${data.name}</h1>
          <h4 className="font-[400] text-[15px] text-[#00000082]">
            ${data.discount_price} * {value}
          </h4>
          <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
            US${totalPrice}
          </h4>
        </div>
        <RxCross1
          className="cursor-pointer"
          size={18}
          onClick={() => removeFromCartHandler(data)}
        />
      </div>
    </div>
  );
};

export default Cart; 