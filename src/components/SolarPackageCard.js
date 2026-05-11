// SolarPackageCard.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { addTocart } from "../redux/actions/cart";
import { addToWishlist, removeFromWishlist } from "../redux/actions/wishlist";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const SolarPackageCard = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const dispatch = useDispatch();

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
    const isItemExists = cart && cart.find((i) => i.id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };
  return (
    <div className="w-[230px] h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
      <div className="transition-transform duration-300 transform hover:scale-105">
        <Link to={`/solar-package/${data.id}`}>
          <img
            src={data.image_URL}
            className="w-full h-[170px] object-cover"
            alt=""
          />
        </Link>
        <Link to="/">
          <h5 className={`${styles.shop_name} pt-1`}>{data.shop.name}</h5>
        </Link>
        <Link to={`/solar-package/${data.id}`}>
          <h4 className="pb-2 font-[500] pt-2">
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>
          <p>{`Capacity: ${data.capacity}`}</p>
          <p>{`Warranty: ${data.warranty}`}</p>

          {/* <p className="font-[400] text-[17px] text-[#68d284] ">{`Price: $${data.price}`}</p> */}
          <div className="flex w-full mt-3">
            <h5 className={`${styles.productDiscountPrice} `}>
              {data.price === 0 ? data.price : data.discount_price}$
            </h5>
            <h4 className={`${styles.price} pr-7`}>
              {data.price ? data.price + " $" : null}
            </h4>
          </div>
        </Link>
      </div>

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

        <AiOutlineShoppingCart
          size={25}
          className="cursor-pointer absolute right-2 top-14"
          onClick={() => addToCartHandler(data.id)}
          color="#444"
          title="Add to cart"
        />
      </div>
    </div>
  );
};

export default SolarPackageCard;
