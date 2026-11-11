import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/styles";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import ProductDetailsCard from "./ProductDetailsCard";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../redux/actions/wishlist";
import { addTocart } from "../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Products/Ratings";
import { resolveAssetUrl } from "../utils/api";

const ProductCard = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const detailUrl = data.type === "package" ? `/solar-package/${data.id}` : `/product/${data.id}`;

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
    toast.success("Added to wishlist!");
  };

  const addToCartHandler = async (id) => {
    const loggedIn = isAuthenticated && localStorage.getItem("customerToken");
    if (!loggedIn) {
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
      await dispatch(addTocart(data, 1));
      toast.success("Item added to cart successfully!");
    } catch (error) {
      toast.error(error.message || "Error adding to cart. Please try again later.");
    }
  };

  return (
    <>
      <div className="w-[230px] h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
        <div className="transition-transform duration-300 transform hover:scale-105">
          <Link to={detailUrl}>
            <img
              src={resolveAssetUrl(data.image_URL)}
              className="w-full h-[170px] object-cover rounded"
              alt={data.name}
            />
          </Link>
          <Link to={`/shop/${data.shop?.id || data.vendorId || 1}`}>
            <h5 className={`${styles.shop_name}`}>{data.shop?.name || "Energy Matrix"}</h5>
          </Link>
          <Link to={detailUrl}>
            <h4 className="pb-2 font-[500]">
              {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
            </h4>

            <div className="flex">
              <Ratings rating={data?.ratings} />
            </div>
            <div className="flex w-full mt-5 items-center justify-between">
              <div className="flex items-center">
                <h5 className={`${styles.productDiscountPrice}`}>
                  ${data.price === 0 ? data.price : data.discount_price}
                </h5>
                <h4 className={`${styles.price} pl-2`}>
                  {data.price && data.price !== data.discount_price ? `$${data.price}` : null}
                </h4>
              </div>
              <span className="font-[400] text-[14px] text-[#68d284]">
                {data.total_sell || 0} sold
              </span>
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
              color="red"
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => addToWishlistHandler(data)}
              color="#333"
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
            title="Add to Cart"
          />
          {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
