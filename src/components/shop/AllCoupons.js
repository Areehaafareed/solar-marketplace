import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import Loader from "../Loader";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/api";

const AllCoupons = () => {
  const { products } = useSelector((state) => state.products);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedProducts, setSelectedProducts] = useState("");
  const [value, setValue] = useState("");

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest("/api/coupons/vendor", { role: "vendor" });
      setCoupons(data.coupons || []);
    } catch (error) {
      toast.error(error.message || "Failed to load coupons.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id) => {
    try {
      await apiRequest(`/api/coupons/${id}`, {
        method: "DELETE",
        role: "vendor",
      });
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast.success("Coupon deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete coupon.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await apiRequest("/api/coupons", {
        method: "POST",
        role: "vendor",
        body: {
          name,
          value: Number(value),
          minAmount: Number(minAmount || 0),
          maxAmount: Number(maxAmount || 0),
          selectedProduct: selectedProducts,
        },
      });
      setCoupons((prev) => [data.coupon, ...prev]);
      toast.success("Coupon code created successfully!");
      setName("");
      setMinAmount("");
      setMaxAmount("");
      setSelectedProducts("");
      setValue("");
      setOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to create coupon.");
    }
  };

  const columns = [
    { field: "id", headerName: "Coupon Id", minWidth: 100, flex: 0.5 },
    { field: "name", headerName: "Coupon Code", minWidth: 180, flex: 1.2 },
    { field: "price", headerName: "Discount", minWidth: 100, flex: 0.6 },
    { field: "minAmount", headerName: "Min Amount", minWidth: 100, flex: 0.6 },
    {
      field: "Delete",
      flex: 0.6,
      minWidth: 100,
      headerName: "Delete",
      sortable: false,
      renderCell: (params) => (
        <button type="button" onClick={() => handleDelete(params.id)}>
          <AiOutlineDelete size={20} className="text-red-600" />
        </button>
      ),
    },
  ];

  const row = coupons.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.value + " %",
    minAmount: item.minAmount ? `$${item.minAmount}` : "$0",
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white p-4 rounded">
          <div className="w-full flex justify-end mb-4">
            <div
              className={`${styles.button} !w-max !h-[45px] px-4 !rounded-[5px]`}
              onClick={() => setOpen(true)}
            >
              <span className="text-white">Create Coupon Code</span>
            </div>
          </div>
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
          {open && (
            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
              <div className="w-[90%] 800px:w-[40%] max-h-[85vh] overflow-y-auto bg-white rounded-md shadow p-6 relative">
                <div className="w-full flex justify-end">
                  <RxCross1
                    size={26}
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <h5 className="text-[26px] font-Poppins text-center mb-4">
                  Create Coupon Code
                </h5>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="pb-1 block">
                      Coupon Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      className="block w-full px-3 h-[38px] border border-gray-300 rounded-[3px] sm:text-sm"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. SUMMER15"
                    />
                  </div>
                  <div>
                    <label className="pb-1 block">
                      Discount Percentage (%) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="95"
                      value={value}
                      required
                      className="block w-full px-3 h-[38px] border border-gray-300 rounded-[3px] sm:text-sm"
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <label className="pb-1 block">Min Amount ($)</label>
                    <input
                      type="number"
                      value={minAmount}
                      className="block w-full px-3 h-[38px] border border-gray-300 rounded-[3px] sm:text-sm"
                      onChange={(e) => setMinAmount(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="pb-1 block">Max Amount ($)</label>
                    <input
                      type="number"
                      value={maxAmount}
                      className="block w-full px-3 h-[38px] border border-gray-300 rounded-[3px] sm:text-sm"
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="pb-1 block">Selected Product (optional)</label>
                    <select
                      className="w-full border h-[38px] rounded-[5px] px-2"
                      value={selectedProducts}
                      onChange={(e) => setSelectedProducts(e.target.value)}
                    >
                      <option value="">All Products</option>
                      {products &&
                        products.map((i) => (
                          <option value={i.name} key={i.id}>
                            {i.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full h-[40px] bg-[#051d40] text-white rounded font-medium cursor-pointer hover:bg-[#0d336b]"
                  >
                    Create Coupon
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllCoupons;
