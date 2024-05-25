import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import styles from "../styles/styles";
import { Link } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../redux/actions/wishlist";
import { addTocart } from "../redux/actions/cart";
import { toast } from "react-toastify";
import { backendURL } from "../config";

const isLoggedIn = localStorage.getItem('isLoggedIn');

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cartItems } = useSelector((state) => state.cart); // Assuming the cart items are stored in the Redux store under cartItems
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

  const addToCartHandler = async (data) => {
    if (!isLoggedIn) {
      // If user is not logged in, show prompt to login
      toast.error("Please log in to add items to your cart.");
      return; // Prevent adding to cart if user is not logged in
    }

    // Check if the item is already in the cart
    const isItemExists = cartItems.some((item) => item.id === data.id);

    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data };
        let email = window.localStorage.getItem("email");
        try {
          // Construct the URL for adding to cart
          const addToCartURL = `${backendURL}/add-to-cart`;

          // Send cart item data to the backend
          const response = await fetch(addToCartURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Include any necessary authentication tokens or headers here
            },
            body: JSON.stringify({ item: cartData, email }),
          });

          // Check if request was successful
          if (response.ok) {
            // Dispatch action to add item to Redux store
            dispatch(addTocart(cartData));

            toast.success("Item added to cart successfully!");
          } else {
            // Handle error response from backend
            const errorMessage = await response.text();
            toast.error(`Error: ${errorMessage}`);
          }
        } catch (error) {
          // Handle network errors or exceptions
          console.error("Error adding to cart:", error);
          toast.error("Error adding to cart. Please try again later.");
        }
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenWishlist(false)}
              />
            </div>
            <h5>wishlist Items is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="w-full flex  justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenWishlist(false)}
                />
              </div>
              {/* item length */}
              <div className={`${styles.normalFlex} p-4`}>
                <AiOutlineHeart size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {wishlist && wishlist.length} items
                </h5>
              </div>

              {/* cart Single Items */}
              <br />
                <div className="w-full border-t">
                  {wishlist &&
                    wishlist.map((i, index) => (
                      <CartSingle
                        key={index}
                        data={i}
                        removeFromWishlistHandler={removeFromWishlistHandler}
                        addToCartHandler={addToCartHandler}
                        cart={cartItems} // Pass the cartItems prop down to CartSingle as cart
                      />
                    ))}
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, removeFromWishlistHandler, addToCartHandler, cart }) => {
  const [value, setValue] = useState(1);
  const totalPrice = data.discount_price * value;
  return (
    <div className="border-b p-6">
      <div className="w-full flex items-center">
        <RxCross1
          className="cursor-pointer"
          size={18}
          onClick={() => removeFromWishlistHandler(data)}
        />
        <img
          src={data.image_URL}
          className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
        />

        <div className="pl-[3px]">
          <h1> ${data.name}</h1>

          <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
            US${totalPrice}
          </h4>
        </div>
        <div>
          <BsCartPlus
            size={20}
            className="cursor-pointer ml-5"
            title="Add to cart"
            onClick={() => addToCartHandler(data, cart)}
          />
        </div>
      </div>
    </div>
  );
};
export default Wishlist;
