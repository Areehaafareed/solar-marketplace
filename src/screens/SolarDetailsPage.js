import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ProductDetails from "../components/Products/ProductDetails";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import SolarDetails from "../components/SolarDetails";
import { solarPackagesData } from "../static/data";

const SolarDetailsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    // const data = solarProducts && solarProducts.find((i) => i.id === id);
    const data =
      solarPackagesData &&
      solarPackagesData.find((item) => item.id === parseInt(id));
    setData(data);
  }, [id]);
  console.log("data is", solarPackagesData);

  return (
    <div>
      <Header />
      <SolarDetails data={data} />
      {/* {data && <SuggestedProduct data={data} />} */}
      <Footer />
    </div>
  );
};

export default SolarDetailsPage;
