import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/styles";
import ProductCard from "./ProductCard";

const BestProduct = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    const list = allProducts ? [...allProducts] : [];
    const sortedData = list.sort((a, b) => (b.total_sell || 0) - (a.total_sell || 0));
    setData(sortedData.slice(0, 5));
  }, [allProducts]);

  return (
    <div>
      <div className={`${styles.section}`}>
        <div
          className="text-3xl font-bold mb-4 text-center"
          style={{ textShadow: "2px 2px 5px orange", marginTop: "20px" }}
        >
          <h1>Best Products</h1>
        </div>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
          {data && data.length !== 0 && data.map((i) => <ProductCard data={i} key={i.id} />)}
        </div>
      </div>
    </div>
  );
};

export default BestProduct;
