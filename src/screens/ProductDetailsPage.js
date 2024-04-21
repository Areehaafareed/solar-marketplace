import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ProductDetails from "../components/Products/ProductDetails";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { solarProducts } from "../static/data";
import SuggestedProduct from "../components/Products/SuggestedProduct";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    // const data = solarProducts && solarProducts.find((i) => i.id === id);
    const data =
      solarProducts && solarProducts.find((item) => item.id === parseInt(id));
    setData(data);
  }, [id]);
  console.log("data is", solarProducts);

  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {data && <SuggestedProduct data={data} />}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
