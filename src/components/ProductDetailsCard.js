import React, { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/styles";
import {
  AiOutlineMessage,
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../redux/actions/cart";
import { toast } from "react-toastify";
import { removeFromWishlist, addToWishlist } from "../redux/actions/wishlist";
import { resolveAssetUrl } from "../utils/api";

const ProductDetailsCard = ({ setOpen, data }) => {
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = isAuthenticated && Boolean(localStorage.getItem("customerToken"));

  const handleMessageSubmit = () => {
    if (!isLoggedIn) {
      toast.info("Please log in to message the vendor.");
      return;
    }
    setOpen(false);
    navigate(
      `/inbox?vendorId=${data.shop?.id || data.vendorId || 1}&vendorName=${encodeURIComponent(
        data.shop?.name || "Vendor"
      )}`
    );
  };

  const decrementCount = () => {
    if (count > 1) setCount(count - 1);
  };

  const incrementCount = () => {
    if (data.stock && count >= data.stock) {
      toast.error("Maximum available stock reached.");
      return;
    }
    setCount(count + 1);
  };

  const addToCartHandler = async (id) => {
    if (!isLoggedIn) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    const isItemExists = cart && cart.find((i) => i.id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
      return;
    }

    if (data.stock < 1) {
      toast.error("Product stock limited!");
      return;
    }

    try {
      await dispatch(addTocart(data, count));
      toast.success("Item added to cart successfully!");
    } catch (error) {
      toast.error(error.message || "Error adding to cart. Please try again later.");
    }
  };

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i.id === data.id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data.id]);

  const removeFromWishlistHandler = (item) => {
    setClick(false);
    dispatch(removeFromWishlist(item));
  };

  const addToWishlistHandler = (item) => {
    setClick(true);
    dispatch(addToWishlist(item));
  };

  return (
    <div className="bg-[#fff]">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
            <RxCross1
              size={28}
              className="absolute right-3 top-3 z-50 cursor-pointer"
              onClick={() => setOpen(false)}
            />
            <div className="block w-full 800px:flex gap-4">
              <div style={{ paddingLeft: "5px" }}>
                {click ? (
                  <AiFillHeart
                    size={30}
                    className="cursor-pointer"
                    onClick={() => removeFromWishlistHandler(data)}
                    color="red"
                    title="Remove from wishlist"
                  />
                ) : (
                  <AiOutlineHeart
                    size={30}
                    className="cursor-pointer"
                    onClick={() => addToWishlistHandler(data)}
                    color="#333"
                    title="Add to wishlist"
                  />
                )}
              </div>
              <div className="w-full 800px:w-[48%]">
                <img
                  src={resolveAssetUrl(data.image_URL)}
                  alt={data.name}
                  className="w-full max-h-[260px] object-contain mb-4"
                />

                <Link
                  to={`/shop/${data.shop?.id || data.vendorId || 1}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center mb-3"
                >
                  <img
                    src={resolveAssetUrl(data.shop?.shop_avatar?.url)}
                    alt=""
                    className="w-[50px] h-[50px] rounded-full mr-2 object-cover"
                  />
                  <div>
                    <h3 className={`${styles.shop_name}`}>{data.shop?.name}</h3>
                    <h5 className="text-[15px]">{data.shop?.ratings} Ratings</h5>
                  </div>
                </Link>
                <div>
                  <div
                    className={`${styles.button} bg-[#000] rounded-[4px] h-11`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-[#fff] flex items-center">
                      Send Message <AiOutlineMessage className="ml-1" />
                    </span>
                  </div>
                  <h5 className="text-[15px] text-green-600 mt-4">
                    In Stock: {data.stock} | ({data.total_sell || 0}) Sold
                  </h5>
                </div>
              </div>

              <div className="w-full 800px:w-[50%] pt-5 pl-[5px]">
                <h1 className={`${styles.productTitle} text-[25px] pb-4`}>
                  {data.name}
                </h1>
                <span className="font-bold text-[17px] text-[#333] font-Roboto">
                  Description
                </span>
                <p className="text-gray-600 mt-1">{data.description}</p>
                <div className="flex pt-3 items-center">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    ${data.discount_price}
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.price ? `$${data.price}` : null}
                  </h3>
                </div>
                <div className="flex items-center mt-8 justify-between pr-3">
                  <div>
                    <button
                      type="button"
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[9px]">
                      {count}
                    </span>
                    <button
                      type="button"
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-r px-4 py-2 shadow-lg hover:opacity-75 transition"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div
                  className={`${styles.button} mt-8 rounded-[4px] h-11 flex items-center`}
                  onClick={() => addToCartHandler(data.id)}
                >
                  <span className="text-[#fff] flex items-center">
                    Add to Cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;
