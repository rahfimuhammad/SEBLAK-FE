import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Modal, ModalOverlay, Button, useDisclosure } from '@chakra-ui/react'
import { formattedDate } from '../function/formattedDate'
import { IsSmallScreen } from '../hooks/useSmallScreen'
import OrderlistsDetail from './OrderlistsDetail'
import { WarningCircle } from 'phosphor-react'
import NewOrderList from './NewOrderList'
import { useOrder } from '../context/OrderProvider'

const Orders = () => {

  const { finishOrder } = useOrder()
  const [orders, setOrders] = useState([])
  const [orderId, setOrderId] = useState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isAddition, setIsAddition] = useState(false)
  const [isOrderDetail, setIsOrderDetail] = useState(false)
  const  isSmall  = IsSmallScreen()
  const [status, setStatus] = useState("processed")

  const getOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/order/finishedorder/${status}`)

      setOrders(response.data?.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getOrders()
  }, [status, setStatus])

  const openOrderDetail = (orderDetail) => {
    setIsOrderDetail(true)
    setOrderId(orderDetail)
    onOpen()
  }

  const closeOrderDetail = async () => {
    setIsOrderDetail(false)
    onClose()
  }

  const openAddition = async () => {
    setIsAddition(true)
    onOpen()
  }

  const closeAddition = async () => {
    setIsAddition(false)
    onClose()
  }

  const handleFinishOrder = (id, client) => {
    finishOrder(id, client)
  }

  const mapOrders = orders?.map((order) => {

    return (
      <Box w={isSmall? '95%' : '550px'} bg='gray.100' borderRadius='10px' border='.5px solid gray' p={5} key={order.id} display="flex" flexDirection="column" gap="7px">
       <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <p><b>{order.client}</b></p>
          <WarningCircle size={25} style={{cursor: "pointer"}} onClick={() => openOrderDetail(order.id)}/>
       </div>
        <p>{formattedDate(order.createdAt)}</p>
        <p>{order?.orderlist?.length} Pesanan</p>
        <div style={{display: "flex", gap: "5px"}}>
          <Button bg='black' color='white' onClick={() => openAddition()}>Addition</Button>
          <Button bg='tomato' color='white' onClick={(e) => finishOrder(e, order.id, order.client)}>Cancel Order</Button>
        </div>
      </Box>
    )
  })

  return (
    <>
        <Box w='100%' overflow='auto' h='100%' display='flex' flexDirection='column' gap='10px' alignItems='center' p='10px 0' onClick={() => console.log(orderId)}>
          <div>
            <Button onClick={() => setStatus("processed")}>Processed</Button>
            <Button onClick={() => setStatus("pending")}>Pending</Button>
          </div>
          {mapOrders}
          <Modal isOpen={isOpen} onClose={isAddition? closeAddition : closeOrderDetail}>
            <ModalOverlay />
            {isOrderDetail && <OrderlistsDetail orderId={orderId} onClose={closeOrderDetail}/>}
            {isAddition &&<NewOrderList orderId={orderId} onClose={closeAddition}/>}
          </Modal>
        </Box>
    </>
  )
}

export default Orders