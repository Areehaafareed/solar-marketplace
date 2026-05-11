import React from "react";
import DashboardSideBar from "../../components/shop/DashboardSideBar";
import DashboardHeader from "../../components/shop/DashboardHeader";
import AllCoupons from "../../components/shop/AllCoupons";

const ShopAllCoupons = () => {
    return (
        <div>
            <DashboardHeader />
            <div className="flex justify-between w-full">
                <div className="w-[100px] 800px:w-[330px]">
                    <DashboardSideBar active={7} />
                </div>
                <div className=" w-full justify-center flex">
                    <AllCoupons />
                </div>
            </div>
        </div>
    );
};

export default ShopAllCoupons;
