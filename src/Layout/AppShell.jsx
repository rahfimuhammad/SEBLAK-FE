import React, { useState } from "react";
import Orders from "../components/Orders";
import CreateOrder from "../components/CreateOrder";
import Transactions from "../components/Transactions";
import Products from "../components/Products";
import { PlusCircle, ArchiveBox, ShoppingCart, ForkKnife } from "phosphor-react";
import "./appShell.css"

const Appshell = () => {

    const [activeTab, setActiveTab] = useState(null)

    const tabs = [
        {tab: CreateOrder, icon: PlusCircle, title: "Create Order" },
        {tab: Orders, icon: ShoppingCart, title: "Orders" },
        {tab: Transactions, icon: ArchiveBox, title: "Transactions" },
        {tab: Products, icon: ForkKnife, title: "Products" },
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
                                    <Icon size={32}/>
                                    <h5 className="tab-title">{tab.title}</h5>
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