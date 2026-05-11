import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getAllProductsShop } from "../../redux/actions/product";

import {
    AiOutlineArrowRight,
    AiOutlineDelete,
    AiOutlineEye,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../Loader";

const AllProducts = () => {
    const { products, isLoading } = useSelector((state) => state.products);
    const { seller } = useSelector((state) => state.seller);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllProductsShop(seller.id));
    }, [dispatch]);

    console.log(products);
    const handleDelete = (id) => {
        dispatch(deleteProduct(id));
        // window.location.reload();
    };

    const columns = [
        { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
        {
            field: "name",
            headerName: "Name",
            minWidth: 180,
            flex: 1.4,
        },
        {
            field: "price",
            headerName: "Price",
            minWidth: 100,
            flex: 0.6,
        },
        {
            field: "Stock",
            headerName: "Stock",
            type: "number",
            minWidth: 80,
            flex: 0.5,
        },

        {
            field: "sold",
            headerName: "Sold out",
            type: "number",
            minWidth: 130,
            flex: 0.6,
        },
        {
            field: "Preview",
            flex: 0.8,
            minWidth: 100,
            headerName: " Preview",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/product/${params.id}`}>
                            <button>
                                <AiOutlineEye size={20} />
                            </button>
                        </Link>
                    </>
                );
            },
        },
        {
            field: "Delete",
            flex: 0.8,
            minWidth: 120,
            headerName: "Delete",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <button onClick={() => handleDelete(params.id)}>
                            <AiOutlineDelete size={20} />
                        </button>
                    </>
                );
            },
        },
    ];

    const row = [];

    products &&
        products.forEach((item) => {
            row.push({
                id: item.id,
                name: item.name,
                price: "US$ " + item.discountPrice,
                Stock: item.stock,
                sold: 10,
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

export default AllProducts;
