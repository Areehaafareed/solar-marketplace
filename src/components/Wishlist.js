import React from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../styles/styles";
import { BsCartPlus } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../redux/actions/wishlist";
import { addTocart } from "../redux/actions/cart";
import { toast } from "react-toastify";
import { resolveAssetUrl } from "../utils/api";

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

  const addToCartHandler = async (data) => {
    const loggedIn = isAuthenticated && localStorage.getItem("customerToken");
    if (!loggedIn) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    const isItemExists = cart && cart.some((item) => item.id === data.id);
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
      toast.error(error.message || "Error adding to cart.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-40">
      <div className="fixed top-0 right-0 h-full w-[85%] 800px:w-[28%] bg-white flex flex-col overflow-y-scroll justify-between shadow-lg">
        {!wishlist || wishlist.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center relative">
            <RxCross1
              size={25}
              className="cursor-pointer absolute top-5 right-5"
              onClick={() => setOpenWishlist(false)}
            />
            <h5 className="text-lg text-gray-600">Wishlist is empty!</h5>
          </div>
        ) : (
          <div>
            <div className="w-full flex justify-between items-center p-4 border-b">
              <div className={`${styles.normalFlex}`}>
                <AiOutlineHeart size={25} />
                <h5 className="pl-2 text-[18px] font-[500]">
                  {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
                </h5>
              </div>
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenWishlist(false)}
              />
            </div>

            <div className="w-full border-t">
              {wishlist.map((i) => (
                <WishlistSingle
                  key={i.id}
                  data={i}
                  removeFromWishlistHandler={removeFromWishlistHandler}
                  addToCartHandler={addToCartHandler}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WishlistSingle = ({ data, removeFromWishlistHandler, addToCartHandler }) => {
  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center justify-between gap-2">
        <RxCross1
          className="cursor-pointer text-gray-500 hover:text-red-600"
          size={18}
          onClick={() => removeFromWishlistHandler(data)}
        />
        <img
          src={resolveAssetUrl(data.image_URL)}
          alt={data.name}
          className="w-[75px] h-[75px] object-cover rounded-[5px]"
        />
        <div className="flex-1 pl-2">
          <h1 className="text-sm font-medium text-gray-800">{data.name}</h1>
          <h4 className="font-[600] text-[15px] pt-[3px] text-[#d02222] font-Roboto">
            US${Number(data.discount_price || 0).toFixed(2)}
          </h4>
        </div>
        <BsCartPlus
          size={22}
          className="cursor-pointer text-gray-700 hover:text-[#051d40]"
          title="Add to cart"
          onClick={() => addToCartHandler(data)}
        />
      </div>
    </div>
  );
};

export default Wishlist;
