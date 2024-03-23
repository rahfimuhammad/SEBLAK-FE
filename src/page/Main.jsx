import React, { useState } from "react";
import { Box } from '@chakra-ui/react'
import Orders from "../components/Orders";
import CreateOrder from "../components/CreateOrder";
import Transactions from "../components/Transactions";
import Products from "../components/Products";
import { PlusCircle, ArchiveBox, ShoppingCart, ForkKnife } from "phosphor-react";

const Main = () => {

    const [activeTab, setActiveTab] = useState(null)

    const tabs = [
        {tab: CreateOrder, icon: PlusCircle, title: "Create Order" },
        {tab: Orders, icon: ShoppingCart, title: "Orders" },
        {tab: Transactions, icon: ArchiveBox, title: "Transactions" },
        {tab: Products, icon: ForkKnife, title: "Products" },
    ]

    const Tab = tabs[activeTab]?.tab

    return (
        <Box width='100%' h='100vh' bg='blue.600' display='flex'>
            <Box w='20%' bg='aliceblue' h='100vh' display='flex' flexDirection='column' gap='20px' alignItems='center'>
                {tabs.map((tab, index) => {
                    const Icon = tab.icon
                    return (
                        <Box w='80%' cursor='pointer' display='flex' gap='10px' alignItems='center' onClick={() => setActiveTab(index)} key={index}>
                            <Icon size={32}/>
                            <h5>{tab.title}</h5>
                        </Box>
                    )
                })}
            </Box>
            <Box w='80%' h='100vh' bg='white' p='10px'>
                {activeTab === null? "" : <Tab/>}
            </Box>
        </Box>
    )
}

export default Main