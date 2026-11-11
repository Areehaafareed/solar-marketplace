import React from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import InboxPanel from "../components/InboxPanel";
import styles from "../styles/styles";

const InboxPage = () => {
  const [searchParams] = useSearchParams();
  const vendorId = searchParams.get("vendorId");
  const vendorName = searchParams.get("vendorName") || "";

  return (
    <div>
      <Header />
      <div className={`${styles.section} py-8`}>
        <InboxPanel
          role="customer"
          initialVendorId={vendorId}
          initialVendorName={vendorName}
        />
      </div>
      <Footer />
    </div>
  );
};

export default InboxPage;
