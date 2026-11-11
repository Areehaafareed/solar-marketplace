import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo5 from "../../logo5.png";
import { AiOutlineGift, AiOutlineLogout } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logoutSeller } from "../../redux/actions/seller";
import { resolveAssetUrl } from "../../utils/api";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutSeller());
    toast.success("Logged out of vendor shop.");
    navigate("/vendor-login");
  };

  return (
    <div className="w-full h-[90px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <img
            src={logo5}
            alt="logo"
            style={{ height: "80px", width: "120px" }}
          />
        </Link>
        <Link to="/" className="text-sm text-blue-600 hover:underline hidden sm:inline">
          View Marketplace
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-2 gap-1">
          <Link to="/dashboard-coupons" className="800px:block hidden" title="Coupons">
            <AiOutlineGift color="#555" size={26} className="mx-3 cursor-pointer" />
          </Link>
          <Link to="/dashboard-products" className="800px:block hidden" title="Products">
            <FiPackage color="#555" size={28} className="mx-3 cursor-pointer" />
          </Link>
          <Link to="/dashboard-orders" className="800px:block hidden" title="Orders">
            <FiShoppingBag color="#555" size={26} className="mx-3 cursor-pointer" />
          </Link>
          <Link to="/dashboard-messages" className="800px:block hidden" title="Messages">
            <BiMessageSquareDetail color="#555" size={26} className="mx-3 cursor-pointer" />
          </Link>
          <Link to={`/vendor/${seller?.id || 1}`} title="Shop Profile" className="mx-2">
            <img
              src={resolveAssetUrl(seller?.avatar || "/Assets/hub.jpg")}
              alt="Shop"
              className="w-[46px] h-[46px] rounded-full object-cover border"
            />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            title="Vendor Logout"
            className="ml-2 flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700"
          >
            <AiOutlineLogout size={16} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
