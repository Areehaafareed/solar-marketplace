import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SolarDetails from "../components/SolarDetails";
import Loader from "../components/Loader";
import { apiRequest } from "../utils/api";

const SolarDetailsPage = () => {
  const { id } = useParams();
  const { packages } = useSelector((state) => state.products);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPkg = async () => {
      setLoading(true);
      try {
        const res = await apiRequest(`/api/products/${id}?type=package`);
        setData(res.product);
      } catch {
        const found =
          packages && packages.find((item) => item.id === parseInt(id, 10));
        setData(found || null);
      } finally {
        setLoading(false);
      }
    };
    loadPkg();
    window.scrollTo(0, 0);
  }, [id, packages]);

  return (
    <div>
      <Header />
      {loading ? (
        <Loader />
      ) : data ? (
        <SolarDetails data={data} />
      ) : (
        <div className="text-center py-20 text-gray-500">Solar package not found.</div>
      )}
      <Footer />
    </div>
  );
};

export default SolarDetailsPage;
