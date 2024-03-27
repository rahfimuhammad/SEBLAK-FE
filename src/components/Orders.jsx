import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Modal, ModalOverlay, Button, useDisclosure } from '@chakra-ui/react'
import { formattedDate } from '../function/formattedDate'
import { IsSmallScreen } from '../hooks/useSmallScreen'
import OrderlistsDetail from './OrderlistsDetail'

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
      <Box w={isSmall? '95%' : '550px'} bg='blue.100' p={10} key={order.id} display="flex" flexDirection="column" gap="7px" onClick={() => getOrderDetail(order.id)}>
        <p>{order.client}</p>
        <p>{formattedDate(order.createdAt)}</p>
        <p>{order?.orderlist?.length} Pesanan</p>
        <Button colorScheme='teal'onClick={(e) => finishOrder(e, order.id, order.client)}>Finish Order</Button>
      </Box>
    )
  })

  return (
    <>
        <Box w='100%' overflow='auto' h='calc(100% - 24px)' display='flex' flexDirection='column' gap='30px' alignItems='center' onClick={() => console.log(orderId)}>
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