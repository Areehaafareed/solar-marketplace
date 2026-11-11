import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutSeller } from "../../redux/actions/seller";
import { resolveAssetUrl } from "../../utils/api";

const ShopInfo = ({ isOwner }) => {
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logoutSeller());
    toast.success("Vendor logged out successfully!");
    navigate("/vendor-login");
  };

  if (!seller) return null;

  return (
    <div>
      <div className="w-full py-5">
        <div className="w-full flex items-center justify-center">
          <img
            src={resolveAssetUrl(seller.avatar || "/Assets/hub.jpg")}
            alt={seller.name}
            className="w-[150px] h-[150px] object-cover rounded-full border-[3px] border-[#3ad132]"
          />
        </div>
        <h3 className="text-center py-2 text-[20px] font-semibold">{seller.name}</h3>
        <p className="text-[14px] text-[#000000a6] px-3 text-center">
          {seller.description}
        </p>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Address</h5>
        <h4 className="text-[#000000a6]">{seller.address || "N/A"}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Phone Number</h5>
        <h4 className="text-[#000000a6]">{seller.phoneNumber || "N/A"}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Total Products</h5>
        <h4 className="text-[#000000a6]">{products?.length ?? seller.totalProducts ?? 0}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Shop Ratings</h5>
        <h4 className="text-[#000000b0]">{seller.ratings || 4.5}/5</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Joined On</h5>
        <h4 className="text-[#000000b0]">
          {seller.createdAt ? seller.createdAt.slice(0, 10) : "2024-01-01"}
        </h4>
      </div>
      {isOwner && (
        <div className="py-3 px-4 space-y-2">
          <Link to="/settings">
            <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}>
              <span className="text-white">Edit Shop</span>
            </div>
          </Link>
          <div
            className={`${styles.button} !w-full !h-[42px] !rounded-[5px] !bg-red-600`}
            onClick={logoutHandler}
          >
            <span className="text-white">Log Out</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopInfo;
