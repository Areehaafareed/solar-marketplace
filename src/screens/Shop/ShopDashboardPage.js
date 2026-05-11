import React from "react";
import DashboardHeader from "../../components/shop/DashboardHeader";
import DashboardSideBar from "../../components/shop/DashboardSideBar";
import DashboardHero from "../../components/shop/DashboardHero";

const ShopDashboardPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[100px] 800px:w-[330px]">
          <DashboardSideBar active={1} />
        </div>
        <DashboardHero/>
      </div>
    </div>
  );
};

export default ShopDashboardPage;
