import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserOrderDetails from "../components/UserOrderDetails";

const OrderDetailsPage = () => {
  return (
    <div>
      <Header />
      <UserOrderDetails />
      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
