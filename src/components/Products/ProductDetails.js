import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineMessage,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import { resolveAssetUrl } from "../../utils/api";

const ProductDetails = ({ data }) => {
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

  const incrementCount = () => {
    if (data?.stock && count >= data.stock) {
      toast.error("Maximum available stock reached.");
      return;
    }
    setCount(count + 1);
  };

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

  const gallery =
    data?.images && data.images.length > 0 ? data.images : [data?.image_URL];

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
                <div className="w-full flex gap-3 mt-4 flex-wrap">
                  {gallery.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`cursor-pointer rounded overflow-hidden ${
                        select === idx ? "border-2 border-[#051d40]" : "border"
                      }`}
                      onClick={() => setSelect(idx)}
                    >
                      <img
                        src={resolveAssetUrl(imgUrl)}
                        alt=""
                        className="h-[100px] w-[100px] object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full 800px:w-[50%] pt-5">
                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                <p className="text-gray-600 mt-2">{data.description}</p>
                <div className="flex pt-4 items-center">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    ${data.discount_price}
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.price && data.price !== data.discount_price ? `$${data.price}` : null}
                  </h3>
                </div>
                <p className="text-sm text-green-600 mt-2">
                  Stock available: {data.stock} | Total sold: {data.total_sell || 0}
                </p>

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
                        ({data.shop?.ratings || 4.5}) Ratings
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

          <ProductDetailsInfo data={data} />
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

const ProductDetailsInfo = ({ data }) => {
  const [active, setActive] = useState(1);
  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-4 rounded">
      <div className="w-full flex justify-between border-b pt-6 pb-2">
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? <div className={`${styles.active_indicator}`} /> : null}
        </div>

        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(2)}
          >
            Product Reviews ({data?.reviews?.length || 0})
          </h5>
          {active === 2 ? <div className={`${styles.active_indicator}`} /> : null}
        </div>

        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(3)}
          >
            Vendor Information
          </h5>
          {active === 3 ? <div className={`${styles.active_indicator}`} /> : null}
        </div>
      </div>

      {active === 1 ? (
        <div className="py-4 text-[17px] leading-8 whitespace-pre-line text-gray-700">
          <p>{data.description}</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-white p-4 rounded">
            <div><strong>Category:</strong> {data.category}</div>
            <div><strong>Stock:</strong> {data.stock} units</div>
            {data.capacity && <div><strong>Capacity:</strong> {data.capacity}</div>}
            {data.warranty && <div><strong>Warranty:</strong> {data.warranty}</div>}
            {data.tags && <div><strong>Tags:</strong> {data.tags}</div>}
          </div>
        </div>
      ) : null}

      {active === 2 ? (
        <div className="w-full min-h-[25vh] py-4 space-y-4">
          {data?.reviews && data.reviews.length > 0 ? (
            data.reviews.map((item, index) => (
              <div className="w-full flex items-start bg-white p-3 rounded shadow-sm" key={index}>
                <img
                  src={resolveAssetUrl(item.avatar)}
                  alt=""
                  className="w-[45px] h-[45px] rounded-full object-cover"
                />
                <div className="pl-3">
                  <div className="w-full flex items-center">
                    <h1 className="font-[600] mr-3">{item.user}</h1>
                    <Ratings rating={item.rating || data?.ratings} />
                  </div>
                  <p className="text-gray-700 mt-1">{item.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full flex justify-center py-8">
              <h5>No reviews yet for this product!</h5>
            </div>
          )}
        </div>
      ) : null}

      {active === 3 && (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <div className="flex items-center">
              <img
                src={resolveAssetUrl(data.shop?.shop_avatar?.url)}
                alt=""
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
              <div className="pl-3">
                <h3 className={`${styles.shop_name}`}>{data.shop?.name}</h3>
                <h5 className="pb-2 text-[15px]">{data.shop?.ratings || 4.5} Ratings</h5>
              </div>
            </div>
            <p className="pt-2 text-gray-700">
              {data.shop?.description ||
                "Verified solar equipment vendor on Energy Matrix Marketplace."}
            </p>
          </div>

          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined on:{" "}
                <span className="font-[500]">
                  {data.shop?.createdAt ? data.shop.createdAt.slice(0, 10) : "2023-03-15"}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Products:{" "}
                <span className="font-[500]">{data.shop?.totalProducts ?? 1}</span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Reviews:{" "}
                <span className="font-[500]">{data.shop?.totalReviews ?? 0}</span>
              </h5>
              <Link to={`/shop/${data.shop?.id || data.vendorId || 1}`}>
                <div className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}>
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
