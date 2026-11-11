import { getAllOrdersOfShop } from "../../redux/actions/order";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../Loader";

const AllRefundOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?.id) {
      dispatch(getAllOrdersOfShop(seller.id));
    }
  }, [dispatch, seller?.id]);

  const refundOrders = (orders || []).filter(
    (item) =>
      item.orderStatus === "Processing refund" ||
      item.orderStatus === "Refund Success"
  );

  const columns = [
    { field: "id", headerName: "Order Id", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.value === "Refund Success" ? "greenColor" : "redColor",
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 130, flex: 0.7 },
    { field: "total", headerName: "Total", minWidth: 130, flex: 0.8 },
    {
      field: "actions",
      flex: 0.7,
      minWidth: 100,
      headerName: "Manage",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/dashboard-orders/${params.id}`}>
          <button type="button">
            <AiOutlineArrowRight size={20} />
          </button>
        </Link>
      ),
    },
  ];

  const row = refundOrders.map((item) => ({
    id: item._id,
    itemsQty: item.qty || 1,
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

export default AllRefundOrders;
