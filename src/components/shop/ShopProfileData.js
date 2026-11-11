import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../ProductCard";
import { getAllProductsShop } from "../../redux/actions/product";

const ShopProfileData = ({ isOwner }) => {
  const [active, setActive] = useState(1);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?.id) {
      dispatch(getAllProductsShop(seller.id));
    }
  }, [dispatch, seller?.id]);

  const allReviews = (products || []).flatMap((p) =>
    (p.reviews || []).map((r) => ({ ...r, productName: p.name }))
  );

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="w-full flex">
          <div className="flex items-center" onClick={() => setActive(1)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 1 ? "text-red-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Shop Products ({products?.length || 0})
            </h5>
          </div>
          <div className="flex items-center" onClick={() => setActive(3)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 3 ? "text-red-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Shop Reviews ({allReviews.length})
            </h5>
          </div>
        </div>
        <div>
          {isOwner && (
            <Link to="/dashboard">
              <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
                <span className="text-[#fff]">Go Dashboard</span>
              </div>
            </Link>
          )}
        </div>
      </div>
      <br />
      {active === 1 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] mb-12 border-0">
          {products &&
            products.map((i) => (
              <div key={i.id} className="mb-4">
                <ProductCard data={i} />
              </div>
            ))}
          {(!products || products.length === 0) && (
            <p className="text-gray-500">No products in this shop yet.</p>
          )}
        </div>
      )}

      {active === 3 && (
        <div className="space-y-3">
          {allReviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            allReviews.map((rev, idx) => (
              <div key={idx} className="bg-white p-4 rounded shadow-sm">
                <div className="flex justify-between">
                  <span className="font-semibold">{rev.user}</span>
                  <span className="text-yellow-600 text-sm">{rev.rating}/5</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">Product: {rev.productName}</p>
                <p className="text-gray-700">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;
