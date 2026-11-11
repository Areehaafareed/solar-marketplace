import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import Loader from "../../components/Loader";
import styles from "../../styles/styles";
import { apiRequest, resolveAssetUrl } from "../../utils/api";

const ShopPreviewPage = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [active, setActive] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShop = async () => {
      setLoading(true);
      try {
        const data = await apiRequest(`/api/vendors/${id}`);
        setVendor(data.vendor);
        setProducts(data.products || []);
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Error loading shop:", err);
      } finally {
        setLoading(false);
      }
    };
    loadShop();
  }, [id]);

  if (loading) return <Loader />;

  return (
    <div>
      <Header />
      <div className={`${styles.section} bg-[#f5f5f5] py-10`}>
        {!vendor ? (
          <div className="bg-white p-8 rounded text-center text-gray-600">
            Shop not found.
          </div>
        ) : (
          <div className="w-full flex flex-col md:flex-row gap-6 justify-between">
            <div className="w-full md:w-[25%] bg-white rounded-[4px] shadow-sm p-4 h-fit">
              <div className="flex flex-col items-center py-4">
                <img
                  src={resolveAssetUrl(vendor.avatar)}
                  alt={vendor.companyName}
                  className="w-[130px] h-[130px] object-cover rounded-full border-[3px] border-[#3ad132]"
                />
                <h3 className="text-center py-2 text-[20px] font-semibold">{vendor.companyName}</h3>
                <p className="text-sm text-gray-600 text-center">{vendor.description}</p>
              </div>
              <div className="p-2 border-t">
                <h5 className="font-[600]">Address</h5>
                <h4 className="text-[#000000a6] text-sm">{vendor.companyAddress || "N/A"}</h4>
              </div>
              <div className="p-2">
                <h5 className="font-[600]">Phone Number</h5>
                <h4 className="text-[#000000a6] text-sm">{vendor.contactNumber || "N/A"}</h4>
              </div>
              <div className="p-2">
                <h5 className="font-[600]">Total Products</h5>
                <h4 className="text-[#000000a6] text-sm">{products.length}</h4>
              </div>
              <div className="p-2">
                <h5 className="font-[600]">Shop Ratings</h5>
                <h4 className="text-[#000000b0] text-sm">{vendor.ratings}/5</h4>
              </div>
            </div>

            <div className="w-full md:w-[73%]">
              <div className="flex gap-6 mb-6 bg-white p-4 rounded shadow-sm">
                <button
                  onClick={() => setActive(1)}
                  className={`font-[600] text-[18px] ${active === 1 ? "text-red-500" : "text-[#333]"}`}
                >
                  Shop Products ({products.length})
                </button>
                <button
                  onClick={() => setActive(2)}
                  className={`font-[600] text-[18px] ${active === 2 ? "text-red-500" : "text-[#333]"}`}
                >
                  Shop Reviews ({reviews.length})
                </button>
              </div>

              {active === 1 && (
                <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-3 mb-12">
                  {products.map((item) => (
                    <ProductCard key={item.id} data={item} />
                  ))}
                  {products.length === 0 && (
                    <p className="text-gray-500">No products listed in this shop yet.</p>
                  )}
                </div>
              )}

              {active === 2 && (
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="bg-white p-6 rounded text-gray-500">No reviews yet.</div>
                  ) : (
                    reviews.map((rev, idx) => (
                      <div key={idx} className="bg-white p-4 rounded shadow-sm">
                        <div className="flex justify-between">
                          <span className="font-semibold">{rev.user}</span>
                          <span className="text-sm text-yellow-600 font-medium">
                            {rev.rating}/5
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">Product: {rev.productName}</p>
                        <p className="text-gray-700">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ShopPreviewPage;
