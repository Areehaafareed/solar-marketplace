import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import Loader from "../Loader";
import { deleteProduct } from "../../redux/actions/product";
import { toast } from "react-toastify";

const AllCoupons = () => {
    const { seller } = useSelector((state) => state.seller);
    const { products } = useSelector((state) => state.products);

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [minAmount, setMinAmount] = useState(null);
    const [maxAmount, setMaxAmount] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [value, setValue] = useState(null);
    const dispatch = useDispatch();

    const handleDelete = async (id) => {
        dispatch(deleteProduct(id));
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        // Construct coupon object
        const coupon = {
            name,
            minAmount,
            maxAmount,
            selectedProducts,
            value,
            shopId: seller._id,
        };

        // Retrieve existing coupons from local storage
        const storedCoupons = JSON.parse(localStorage.getItem("coupons")) || [];

        // Update local storage with the new coupon
        localStorage.setItem("coupons", JSON.stringify([...storedCoupons, coupon]));

        // Show success message
        toast.success("Coupon code created successfully!");

        // Reset form fields and close modal
        setName("");
        setMinAmount("");
        setMaxAmount("");
        setSelectedProducts([]);
        setValue("");
        setOpen(false);
    };

    const columns = [
        { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
        {
            field: "name",
            headerName: "Coupon Code",
            minWidth: 180,
            flex: 1.4,
        },
        {
            field: "price",
            headerName: "Value",
            minWidth: 100,
            flex: 0.6,
        },
        {
            field: "Delete",
            flex: 0.8,
            minWidth: 120,
            headerName: "",
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
    coupons &&
        coupons.forEach((item) => {
            row.push({
                id: item.id,
                name: item.name,
                price: item.value + " %",
                sold: 10,
            });
        });
    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full mx-8 pt-1 mt-10 bg-white">
                    <div className="w-full flex justify-end">
                        <div
                            className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
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
                            <div className="w-[90%] 800px:w-[40%] h-[80vh] bg-white rounded-md shadow p-4">
                                <div className="w-full flex justify-end">
                                    <RxCross1
                                        size={26}
                                        className="cursor-pointer"
                                        onClick={() => setOpen(false)}
                                    />
                                </div>
                                <h5 className="text-[27px] font-Poppins text-center">
                                    Create Coupon code
                                </h5>
                                {/*  {/* create coupon code */}
                                <form onSubmit={handleSubmit} aria-required={true}>
                                    <div>
                                        <label className="pb-2">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={name}
                                            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your coupon code name..."
                                        />
                                    </div>
                                    <br />
                                    <div>
                                        <label className="pb-2">
                                            Discount Percentage{" "}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="value"
                                            value={value}
                                            required
                                            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            onChange={(e) => setValue(e.target.value)}
                                            placeholder="Enter your coupon code value..."
                                        />
                                    </div>
                                    <br />
                                    <div>
                                        <label className="pb-2">Min Amount</label>
                                        <input
                                            type="number"
                                            name="value"
                                            value={minAmount}
                                            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            onChange={(e) => setMinAmount(e.target.value)}
                                            placeholder="Enter your coupon code min amount..."
                                        />
                                    </div>
                                    <br />
                                    <div>
                                        <label className="pb-2">Max Amount</label>
                                        <input
                                            type="number"
                                            name="value"
                                            value={maxAmount}
                                            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            onChange={(e) => setMaxAmount(e.target.value)}
                                            placeholder="Enter your coupon code max amount..."
                                        />
                                    </div>
                                    <br />
                                    <div>
                                        <label className="pb-2">Selected Product</label>
                                        <select
                                            className="w-full mt-2 border h-[35px] rounded-[5px]"
                                            value={selectedProducts}
                                            onChange={(e) => setSelectedProducts(e.target.value)}
                                        >
                                            <option value="Choose your selected products">
                                                Choose a selected product
                                            </option>
                                            {products &&
                                                products.map((i) => (
                                                    <option value={i.name} key={i.name}>
                                                        {i.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="mt-10 w-[100%] flex items-center justify-center">
                                        <div>
                                            <input
                                                type="submit"
                                                value="Create"
                                                className="mt-10 appearance-none block w-full  px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
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
