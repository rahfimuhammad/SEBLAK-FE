import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Modal, ModalOverlay, Button, useDisclosure } from '@chakra-ui/react'
import { formattedDate } from '../function/formattedDate'
import { IsSmallScreen } from '../hooks/useSmallScreen'
import OrderlistsDetail from './OrderlistsDetail'
import { WarningCircle } from 'phosphor-react'

const Orders = () => {

  const [orders, setOrders] = useState([])
  const [orderId, setOrderId] = useState()
  const { isOpen, onOpen, onClose } = useDisclosure()
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

  const finishOrder = async (e, orderId, client) => {
    e.stopPropagation()

    try {
      const response = await axios.patch(`http://localhost:5000/order/finish/${orderId}`, {
        client: client
      })

      console.log(response)
      getOrders()
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    getOrders()
  }, [status, setStatus])

  const getOrderDetail = (orderDetail) => {
    setOrderId(orderDetail)
    onOpen()
  }

  const mapOrders = orders?.map((order) => {

    return (
      <Box w={isSmall? '95%' : '550px'} bg='gray.100' borderRadius='10px' border='.5px solid gray' p={5} key={order.id} display="flex" flexDirection="column" gap="7px">
       <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <p><b>{order.client}</b></p>
          <WarningCircle size={25} style={{cursor: "pointer"}} onClick={() => getOrderDetail(order.id)}/>
       </div>
        <p>{formattedDate(order.createdAt)}</p>
        <p>{order?.orderlist?.length} Pesanan</p>
        <div style={{display: "flex", gap: "5px"}}>
          <Button bg='black' color='white' onClick={(e) => finishOrder(e, order.id, order.client)}>Adition</Button>
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
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <OrderlistsDetail orderId={orderId} onClose={onClose}/>
          </Modal>
        </Box>
    </>
  )
}

export default Orders