import React from "react";
import DashboardHeader from "../../components/shop/DashboardHeader";
import DashboardSideBar from "../../components/shop/DashboardSideBar";
import CreateProduct from "../../components/shop/CreateProduct";

const ShopCreateProduct = () => {
    return (
        <div>
            <DashboardHeader />
            <div className="flex items-center justify-between w-full">
                <div className="w-[100px] 800px:w-[330px]">
                    <DashboardSideBar active={4} />
                </div>
                <div className=" w-full justify-center flex">
                    <CreateProduct />
                </div>
            </div>
        </div>
    );
};

export default ShopCreateProduct;
