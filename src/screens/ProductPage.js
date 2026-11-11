import React, { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/styles";
import ProductCard from "../components/ProductCard";
import { apiRequest } from "../utils/api";

const ProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { category: paramCategory } = useParams();
  const { allProducts } = useSelector((state) => state.products);

  const categoryQuery = searchParams.get("category") || paramCategory || "";
  const searchQuery = searchParams.get("search") || "";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ type: "product", sort: "bestseller" });
        if (categoryQuery) params.set("category", categoryQuery);
        if (searchQuery) params.set("search", searchQuery);
        const res = await apiRequest(`/api/products?${params.toString()}`);
        setData(res.products || []);
      } catch {
        // Fallback to Redux store
        let list = allProducts ? [...allProducts] : [];
        if (categoryQuery) {
          list = list.filter(
            (i) => i.category?.toLowerCase() === categoryQuery.toLowerCase()
          );
        }
        if (searchQuery) {
          list = list.filter((i) =>
            i.name?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setData(list);
      } finally {
        setLoading(false);
      }
    };
    fetchFiltered();
  }, [categoryQuery, searchQuery, allProducts]);

  const categories = Array.from(
    new Set((allProducts || []).map((p) => p.category).filter(Boolean))
  );

  return (
    <div>
      <Header activeHeading={3} />
      <br />

      <div className={`${styles.section} min-h-[60vh]`}>
        <div
          className="text-3xl font-bold mb-4 text-center"
          style={{ textShadow: "2px 2px 5px orange" }}
        >
          <h1>{categoryQuery ? categoryQuery : "Products"}</h1>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <button
            onClick={() => setSearchParams({})}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              !categoryQuery && !searchQuery
                ? "bg-[#051d40] text-white border-[#051d40]"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSearchParams({ category: cat })}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                categoryQuery === cat
                  ? "bg-[#051d40] text-white border-[#051d40]"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading products...</div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {data.map((i) => (
              <ProductCard data={i} key={i.id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No products found{categoryQuery ? ` in "${categoryQuery}"` : ""}.
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
