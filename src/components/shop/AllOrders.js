import { getAllOrdersOfShop } from "../../redux/actions/order";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../Loader";

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?.id) {
      dispatch(getAllOrdersOfShop(seller.id));
    }
  }, [dispatch, seller?.id]);

  const columns = [
    { field: "id", headerName: "Order Id", minWidth: 150, flex: 0.8 },
    { field: "customer", headerName: "Customer", minWidth: 150, flex: 0.9 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.8,
      cellClassName: (params) =>
        params.value === "Delivered" ? "greenColor" : "redColor",
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 100, flex: 0.5 },
    { field: "total", headerName: "Total", minWidth: 120, flex: 0.7 },
    {
      field: "actions",
      flex: 0.6,
      minWidth: 90,
      headerName: "Manage",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/dashboard-orders/${params.id}`}>
          <button type="button" title="View & Update Order">
            <AiOutlineArrowRight size={20} />
          </button>
        </Link>
      ),
    },
  ];

  const row = (orders || []).map((item) => ({
    id: item._id,
    customer: item.user?.name || "Customer",
    itemsQty: item.qty || (item.orderItems || []).reduce((s, i) => s + (i.qty || 1), 0),
    total: "US$ " + item.totalPrice,
    status: item.orderStatus,
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

export default AllOrders;
