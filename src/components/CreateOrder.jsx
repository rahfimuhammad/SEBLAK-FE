import React, { useState } from 'react'
import { useOrder } from '../context/OrderProvider'
import OrderImage from "../assets/OrderImage.png"
import { useDisclosure } from '@chakra-ui/react'
import { Box, ModalOverlay, Button, Modal } from '@chakra-ui/react'
import NewOrderList from './NewOrderList'
import Orderlist from './Orderlist'
import { IsSmallScreen } from '../hooks/useSmallScreen'
import NewOrder from './NewOrder'

const CreateOrder = () => {

  const { createOrder, createOrderAndAddItems, orderId, orderlistId, processOrder, orderlists, getOrderlists } = useOrder()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [clientName, setClientName] = useState("")
  const isSmall = IsSmallScreen()

  const handleCreateOrder = () => {
    createOrder(clientName)
    onClose()
  }

  const handleCreateOrderlist = () => {
    console.log(orderId)
    onOpen()
  }

  const handleProcessOrder = () => {
    processOrder(clientName, orderId)
  }

  return (
    <>
        {orderId && <Box bg='gray.200' w={isSmall? '95%' : '550px'} mt='10px' mb='10px' h='200px' borderRadius='10px' onClick={handleCreateOrderlist}>Add Orderlist</Box>}
        <div style={{display: "flex", flexDirection: "column", gap: "10px", width: "100%", alignItems: "center"}}>
          {orderlists.map((orderlist, index) => (
              <Orderlist key={index} orderlist={orderlist} index={index}/>
          ))}
        </div>
        {!orderId 
        &&
        <div style={{width: "100%", height: `${isSmall? "calc(100vh - 120px)" : "calc(100vh - 60px)"}`, display: "flex", justifyContent: "center", alignItems: "center"}}>
          <div style={{display: "flex", flexDirection: "column", gap: "10px", alignItems: "center"}}>
            <img src={OrderImage} alt='order' style={{width: "250px", height: "auto"}}/>
            <Button onClick={onOpen}>Create New Order</Button>
          </div>
        </div>}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
              {orderId
              ? <NewOrderList orderlistId={orderId} onClose={onClose} getOrderlists={getOrderlists} /> 
              : <NewOrder clientName={clientName} setClientName={setClientName} onClose={onClose} actionFunction={handleCreateOrder}/>
              }
        </Modal>
        {orderlists.length?  <Button colorScheme='teal' mt='10px' mb='10px' onClick={handleProcessOrder}>Save Order</Button> : null}
    </>
  )
}

export default CreateOrder