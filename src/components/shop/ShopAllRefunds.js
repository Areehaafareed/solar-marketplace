import React from 'react'
import DashboardHeader from './DashboardHeader'
import DashboardSideBar from './DashboardSideBar'
import AllRefundOrders from './AllRefundOrders'

const ShopAllRefunds = () => {
  return (
    <div>
            <DashboardHeader />
            <div className="flex justify-between w-full">
                <div className="w-[100px] 800px:w-[330px]">
                    <DashboardSideBar active={7} />
                </div>
                <div className=" w-full justify-center flex">
                    <AllRefundOrders />
                </div>
            </div>
        </div>
  )
}

export default ShopAllRefunds
