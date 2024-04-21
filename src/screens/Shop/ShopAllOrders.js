import React from "react";
import DashboardSideBar from "../../components/shop/DashboardSideBar";
import DashboardHeader from "../../components/shop/DashboardHeader";
import AllOrders from "../../components/shop/AllOrders";

const ShopAllOrders = () => {
    return (
        <div>
            <DashboardHeader />
            <div className="flex justify-between w-full">
                <div className="w-[100px] 800px:w-[330px]">
                    <DashboardSideBar active={2} />
                </div>
                <div className=" w-full justify-center flex">
                    <AllOrders />
                </div>
            </div>
        </div>
    );
};

export default ShopAllOrders;
