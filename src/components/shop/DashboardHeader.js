import React from "react";
import { Link } from "react-router-dom";
import logo5 from "../../logo5.png";
import { AiOutlineGift } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { useSelector } from "react-redux";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  return (
    <div className="w-full h-[90px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/dashboard">
          <img
            src={logo5}
            alt="logo"
            style={{
              height: "100px",
              width: "150px",
            }}
          />
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Link to="/dashboard/coupons" className="800px:block hidden">
            <AiOutlineGift
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-products" className="800px:block hidden">
            <FiShoppingBag
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-orders" className="800px:block hidden">
            <FiPackage color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to="/dashboard-messages" className="800px:block hidden">
            <BiMessageSquareDetail
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to={`/vendor/${seller.id}`}>
            <img
              src="../../../Assets/hub.jpg"
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
