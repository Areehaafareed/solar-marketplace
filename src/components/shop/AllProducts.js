import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getAllProducts, getAllProductsShop } from "../../redux/actions/product";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../Loader";
import { toast } from "react-toastify";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?.id) {
      dispatch(getAllProductsShop(seller.id));
    }
  }, [dispatch, seller?.id]);

  const handleDelete = async (id) => {
    await dispatch(deleteProduct(id));
    dispatch(getAllProducts());
    toast.success("Product deleted successfully!");
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 100, flex: 0.5 },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.4 },
    { field: "type", headerName: "Type", minWidth: 90, flex: 0.5 },
    { field: "price", headerName: "Price", minWidth: 100, flex: 0.6 },
    { field: "Stock", headerName: "Stock", type: "number", minWidth: 80, flex: 0.5 },
    { field: "sold", headerName: "Sold out", type: "number", minWidth: 100, flex: 0.5 },
    {
      field: "Preview",
      flex: 0.6,
      minWidth: 90,
      headerName: "Preview",
      sortable: false,
      renderCell: (params) => (
        <Link
          to={
            params.row.type === "package"
              ? `/solar-package/${params.id}`
              : `/product/${params.id}`
          }
        >
          <button type="button" title="Preview">
            <AiOutlineEye size={20} />
          </button>
        </Link>
      ),
    },
    {
      field: "Delete",
      flex: 0.6,
      minWidth: 90,
      headerName: "Delete",
      sortable: false,
      renderCell: (params) => (
        <button type="button" onClick={() => handleDelete(params.id)} title="Delete">
          <AiOutlineDelete size={20} className="text-red-600" />
        </button>
      ),
    },
  ];

  const row = (products || []).map((item) => ({
    id: item.id,
    name: item.name,
    type: item.type || "product",
    price: "US$ " + (item.discount_price ?? item.discountPrice ?? 0),
    Stock: item.stock,
    sold: item.total_sell || 0,
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllProducts;
