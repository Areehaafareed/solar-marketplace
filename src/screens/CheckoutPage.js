import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Checkout from "../components/Checkout";
import CheckoutSteps from "../components/CheckoutSteps";

const CheckoutPage = () => {
  return (
    <div>
      <Header />
      <br />
      <br />
      <CheckoutSteps active={1} />
      <Checkout />
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default CheckoutPage;
