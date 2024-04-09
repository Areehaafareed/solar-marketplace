import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/styles";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import ProductDetailsCard from "./ProductDetailsCard";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../redux/actions/wishlist";
import { addTocart } from "../redux/actions/cart";
import { toast } from "react-toastify";

const ProductCard = ({ data }) => {
  const [hovered, setHovered] = useState(false);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state to track user's login status
  const dispatch = useDispatch();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(!!isLoggedIn); // Convert to boolean
  }, []);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i.id === data.id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    if (!isLoggedIn) {
      // If user is not logged in, show prompt to login
      toast.error("Please log in to add items to your cart.");
      return; // Prevent adding to cart if user is not logged in
    }

    const isItemExists = cart && cart.find((i) => i.id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <>
      <div className="w-[230px] h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer ">
        <div className="flex justify-end"></div>
        <div
          className="transition-transform duration-300 transform hover:scale-105"
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
        >
          <Link to={`/product/${data.id}`}>
            <img
              src={data.image_URL}
              className="w-full h-[170px] object-cover"
              alt=""
            />
          </Link>
          <Link to="/">
            <h5 className={`${styles.shop_name}`}>{data.shop.name}</h5>
          </Link>
          <Link to={`/product/${data.id}`}>
            <h4 className="pb-2 font-[500]">
              {data.name.length > 40
                ? data.name.slice(0, 40) + "..."
                : data.name}
            </h4>

            <div className="flex">
              <AiFillStar
                className="mr-2 cursor-pointer"
                size={20}
                color="#f6ba00"
              />
              <AiFillStar
                className="mr-2 cursor-pointer"
                size={20}
                color="#f6ba00"
              />
              <AiFillStar
                className="mr-2 cursor-pointer"
                size={20}
                color="#f6ba00"
              />
              <AiFillStar
                className="mr-2 cursor-pointer"
                size={20}
                color="#f6ba00"
              />
              <AiOutlineStar
                className="mr-2 cursor-pointer"
                size={20}
                color="#f6ba00"
              />
            </div>
            <div className="flex w-full " style={{ marginTop: "20px" }}>
              <div className="flex w-full" style={{ marginTop: "30px" }}>
                <h5 className={`${styles.productDiscountPrice} `}>
                  {data.price === 0 ? data.price : data.discount_price}$
                </h5>
                <h4 className={`${styles.price} pr-7`}>
                  {data.price ? data.price + " $" : null}
                </h4>

                <span className="font-[400] text-[17px] text-[#68d284] ">
                  {data.total_sell} sold
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* side options */}

        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => removeFromWishlistHandler(data)}
              color={click ? "red" : "#333"}
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => addToWishlistHandler(data)}
              color={click ? "red" : "#333"}
              title="Add to wishlist"
            />
          )}
          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)}
            color="#333"
            title="Quick view"
          />
          <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer absolute right-2 top-24"
            onClick={() => addToCartHandler(data.id)}
            color="#444"
            title="Add to cart"
          />
          {open ? (
            <ProductDetailsCard
              setOpen={setOpen}
              data={data}
            // addToCart={addToCart}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ProductCard;