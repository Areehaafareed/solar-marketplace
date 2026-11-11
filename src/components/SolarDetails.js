import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineMessage,
} from "react-icons/ai";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../redux/actions/wishlist";
import { addTocart } from "../redux/actions/cart";
import { resolveAssetUrl } from "../utils/api";

const SolarDetails = ({ data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.user);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = isAuthenticated && Boolean(localStorage.getItem("customerToken"));

  useEffect(() => {
    if (data && wishlist && wishlist.find((i) => i.id === data.id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data]);

  const removeFromWishlistHandler = (item) => {
    setClick(false);
    dispatch(removeFromWishlist(item));
  };

  const addToWishlistHandler = (item) => {
    setClick(true);
    dispatch(addToWishlist(item));
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

    if (data.stock !== undefined && data.stock < 1) {
      toast.error("Product stock limited!");
      return;
    }

    try {
      await dispatch(addTocart(data, count));
      toast.success("Package added to cart successfully!");
    } catch (error) {
      toast.error(error.message || "Error adding package to cart.");
    }
  };

  const incrementCount = () => setCount(count + 1);
  const decrementCount = () => {
    if (count > 1) setCount(count - 1);
  };

  const handleMessageSubmit = () => {
    if (!isLoggedIn) {
      toast.info("Please log in to message the vendor.");
      navigate("/LoginPage");
      return;
    }
    navigate(
      `/inbox?vendorId=${data.shop?.id || data.vendorId || 1}&vendorName=${encodeURIComponent(
        data.shop?.name || "Vendor"
      )}`
    );
  };

  const gallery = data?.images?.length ? data.images : [data?.image_URL];

  return (
    <div className="bg-white">
      {data ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex gap-8">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={resolveAssetUrl(gallery[select] || data.image_URL)}
                  alt={data.name}
                  className="w-[85%] max-h-[420px] object-contain rounded"
                />
                <div className="w-full flex gap-3 mt-4">
                  {gallery.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`cursor-pointer ${select === idx ? "border-2 border-[#051d40]" : "border"}`}
                      onClick={() => setSelect(idx)}
                    >
                      <img src={resolveAssetUrl(imgUrl)} alt="" className="h-[100px] w-[100px] object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full 800px:w-[50%] pt-5">
                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                <p className="text-gray-600 mt-2">{data.description}</p>
                {data.capacity && (
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Capacity:</strong> {data.capacity} | <strong>Warranty:</strong> {data.warranty}
                  </p>
                )}
                {data.features && data.features.length > 0 && (
                  <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                    {data.features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                )}
                <div className="flex pt-4 items-center">
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
                  <div>
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
                </div>
                <div
                  className={`${styles.button} !mt-6 !rounded !h-11 flex items-center`}
                  onClick={() => addToCartHandler(data.id)}
                >
                  <span className="text-white flex items-center">
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
                <div className="flex items-center pt-8 flex-wrap gap-4">
                  <Link
                    to={`/shop/${data.shop?.id || data.vendorId || 1}`}
                    className="flex items-center"
                  >
                    <img
                      src={resolveAssetUrl(data.shop?.shop_avatar?.url)}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2 object-cover"
                    />
                    <div className="pr-4">
                      <h3 className={`${styles.shop_name} pb-1 pt-1`}>
                        {data.shop?.name}
                      </h3>
                      <h5 className="text-[15px]">
                        ({data.shop?.ratings}) Ratings
                      </h5>
                    </div>
                  </Link>
                  <div
                    className={`${styles.button} bg-[#6443d1] !rounded !h-11`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-white flex items-center">
                      Send Message <AiOutlineMessage className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

export default SolarDetails;
