import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import styles from "../styles/styles";
import ProductCard from "../components/ProductCard";
// import { useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import { solarProducts } from "../static/data";

const ProductPage = () => {
  //   const [searchParams] = useSearchParams();
  //   const categoryData = searchParams("category");
  const { category: categoryData } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (categoryData === undefined) {
      const d =
        solarProducts &&
        solarProducts.sort((a, b) => a.total_sell - b.total_sell);
      setData(d);
    } else {
      const d =
        solarProducts &&
        solarProducts.filter((i) => i.category === categoryData);
      setData(d);
    }
  }, []);
  return (
    <div>
      <Header activeHeading={3} />
      <br />

      <div className={`${styles.section}`}>
        <div
          className="text-3xl font-bold mb-4 text-center"
          style={{ textShadow: "2px 2px 5px orange" }}
        >
          <h1>Products</h1>
        </div>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
          {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
          {data && data.length === 0 ? <h1></h1> : null}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
