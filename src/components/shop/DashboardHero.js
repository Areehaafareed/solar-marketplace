import React, { useEffect } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import styles from "../../styles/styles";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    if (seller?.id) {
      dispatch(getAllOrdersOfShop(seller.id));
      dispatch(getAllProductsShop(seller.id));
    }
  }, [dispatch, seller?.id]);

  const deliveredOrders = (orders || []).filter(
    (item) => item.orderStatus === "Delivered"
  );
  const totalEarning = deliveredOrders.reduce(
    (acc, item) => acc + Number(item.totalPrice || 0),
    0
  );
  const serviceCharge = totalEarning * 0.1;
  const availableBalance = (totalEarning - serviceCharge).toFixed(2);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.value === "Delivered" ? "greenColor" : "redColor",
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 110, flex: 0.6 },
    { field: "total", headerName: "Total", minWidth: 120, flex: 0.7 },
    {
      field: "actions",
      flex: 0.6,
      minWidth: 100,
      headerName: "View",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/dashboard-orders/${params.id}`}>
          <button type="button" title="View Order">
            <AiOutlineArrowRight size={20} />
          </button>
        </Link>
      ),
    },
  ];

  const row = (orders || []).map((item) => ({
    id: item._id,
    itemsQty: item.qty || (item.orderItems || []).reduce((s, i) => s + (i.qty || 1), 0),
    total: "US$ " + item.totalPrice,
    status: item.orderStatus,
  }));

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
      <div className="w-full block 800px:flex items-center justify-between gap-4">
        <div className="w-full mb-4 800px:w-[32%] min-h-[18vh] bg-white shadow rounded px-4 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              Account Balance{" "}
              <span className="text-[14px]">(after 10% service charge)</span>
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">${availableBalance}</h5>
          <Link to="/dashboard-orders">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Earnings & Orders</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[32%] min-h-[18vh] bg-white shadow rounded px-4 py-5">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              All Orders
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
            {orders ? orders.length : 0}
          </h5>
          <Link to="/dashboard-orders">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[32%] min-h-[18vh] bg-white shadow rounded px-4 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              All Products
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
            {products ? products.length : 0}
          </h5>
          <Link to="/dashboard-products">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Products</h5>
          </Link>
        </div>
      </div>

      <br />
      <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
      <div className="w-full min-h-[45vh] bg-white rounded">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </div>
  );
};

export default DashboardHero;
