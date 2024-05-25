


import { getAllOrdersOfShop } from "../../redux/actions/order";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    AiOutlineArrowRight,
    AiOutlineDelete,
    AiOutlineEye,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../Loader";


const AllRefundOrders = () => {
    const { orders, isLoading } = useSelector((state) => state.order);
    const { seller } = useSelector((state) => state.seller);

    const refundOrders = orders && orders.filter((item) => item.orderStatus === "Processing refund"  || item.orderStatus === "Refund Success");

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllOrdersOfShop(seller.id));
    }, [dispatch]);

    const columns = [
        { field: "id", headerName: "Order Id", minWidth: 150, flex: 0.7 },

        {
            field: "status",
            headerName: "Status",
            minWidth: 130,
            flex: 0.7,
            cellClassName: (params) => {
                return params.value === "Delivered" ? "greenColor" : "redColor";
            },
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 130,
            flex: 0.7,
        },

        {
            field: "total",
            headerName: "Total",
            type: "number",
            minWidth: 130,
            flex: 0.8,
        },
        {
            field: "",
            flex: 1,
            minWidth: 150,
            headerName: " ",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/dashboard-orders/${params.id}`}>
                            <button>
                                <AiOutlineArrowRight size={20} />
                            </button>
                        </Link>
                    </>
                );
            },
        },
    ];

    const row = [];

    refundOrders &&
    refundOrders.forEach((item) => {
            row.push({
                id: item._id,
                itemsQty: item.qty,
                total: "US$ " + item.totalPrice,
                status: item.orderStatus,
            });
        });

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
