import React from "react";
import DashboardHeader from "../../components/shop/DashboardHeader";
import DashboardSideBar from "../../components/shop/DashboardSideBar";
import InboxPanel from "../../components/InboxPanel";

const ShopInboxPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={5} />
        </div>
        <div className="w-full p-6">
          <InboxPanel role="vendor" />
        </div>
      </div>
    </div>
  );
};

export default ShopInboxPage;
