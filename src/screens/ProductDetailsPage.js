import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import ProductDetails from "../components/Products/ProductDetails";
import Footer from "../components/Footer";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import Loader from "../components/Loader";
import { apiRequest } from "../utils/api";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { allProducts } = useSelector((state) => state.products);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await apiRequest(`/api/products/${id}`);
        setData(res.product);
      } catch {
        const found =
          allProducts && allProducts.find((item) => item.id === parseInt(id, 10));
        setData(found || null);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
    window.scrollTo(0, 0);
  }, [id, allProducts]);

  return (
    <div>
      <Header />
      {loading ? (
        <Loader />
      ) : data ? (
        <>
          <ProductDetails data={data} />
          <SuggestedProduct data={data} />
        </>
      ) : (
        <div className="text-center py-20 text-gray-500">Product not found.</div>
      )}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
