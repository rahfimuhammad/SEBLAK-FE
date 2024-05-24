import React, { useState } from "react";
import Orders from "../components/Orders";
import CreateOrder from "../components/CreateOrder";
import Transactions from "../components/Transactions";
import Products from "../components/Products";
import Analytics from "../components/Analytics";
import { PlusCircleFilled, CarryOutFilled, ShoppingFilled, ProductFilled, PieChartFilled } from "@ant-design/icons";

import "./appShell.css"

const Appshell = () => {

    const [activeTab, setActiveTab] = useState(0)

    const tabs = [
        {tab: CreateOrder, icon: PlusCircleFilled, title: "Create Order" },
        {tab: Orders, icon: ShoppingFilled, title: "Orders" },
        {tab: Transactions, icon: CarryOutFilled, title: "Transactions" },
        {tab: Products, icon: ProductFilled, title: "Products" },
        {tab: Analytics, icon: PieChartFilled, title: "Analytics" },
    ]

    const Tab = tabs[activeTab]?.tab

    return (
        <div className="appshell-container">
            <div className="sidebar">
                <div className="nav">
                    {tabs.map((tab, index) => {
                        const Icon = tab.icon
                        return (
                            <div className={`tab ${activeTab === index? "active" : ""}`}  onClick={() => setActiveTab(index)} key={index}>
                                <div className="tab-wrapper">
                                    <Icon style={{fontSize: "32px"}}/>
                                    <h5 style={{fontWeight: "bold"}} className="tab-title">{tab.title}</h5>
                                </div>       
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="main-content">
                <div className="header">
                    <h1>{tabs[activeTab]?.title}</h1>
                </div>
                <div className="content-container">
                    {activeTab === null? "" : <Tab/>}
                </div>
            </div>
        </div>
    )
}

export default Appshell