import React from "react";
import DashboardHeader from "../../components/shop/DashboardHeader";
import Footer from "../../components/Footer";
import OrderDetails from "../../components/shop/OrderDetails";

const ShopAllOrderDetails = () => {
    return (
        <div>
            <DashboardHeader />
            <OrderDetails />
            <Footer />
        </div>
    );
};

export default ShopAllOrderDetails;
