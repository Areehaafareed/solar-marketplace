import React from "react";
import Payment from "../components/Payment";
import Footer from "../components/Footer";
import Header from "../components/Header";
import CheckoutSteps from "../components/CheckoutSteps";

const PayementPage = () => {
  return (
    <div className="w-full min-h-screen bg-[#f6f9fc]">
      <Header />
      <br />
      <br />
      <CheckoutSteps active={2} />
      <Payment />
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default PayementPage;
