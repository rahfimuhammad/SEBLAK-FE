import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Modal, ModalOverlay, Button, useDisclosure } from '@chakra-ui/react'
import { formattedDate } from '../function/formattedDate'
import { IsSmallScreen } from '../function/detectSmallScreen'
import OrderlistsDetail from './OrderlistsDetail'
import { WarningCircle } from 'phosphor-react'
import NewOrderList from './NewOrderList'
import { useOrder } from '../context/OrderProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Spinner from './Spinner'

const Orders = () => {

  const { finishOrder, deleteOrder } = useOrder()
  const [orders, setOrders] = useState([])
  const [orderlists, setOrderlists] = useState([])
  const [page, setPage] = useState(1)
  const [orderId, setOrderId] = useState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isAddition, setIsAddition] = useState(false)
  const [isOrderDetail, setIsOrderDetail] = useState(false)
  const  isSmall  = IsSmallScreen()
  const [status, setStatus] = useState("processed")
  const [loading, setLoading] = useState(false)

  const getOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        // `http://192.168.100.10:5000/order/finishedorder/${status}?page=${page}`
        // `http://192.168.1.101:5000/order/finishedorder/${status}?page=${page}`
        `https://seblak-api-40223dc59db0.herokuapp.com/order/finishedorder/${status}?page=${page}`
      )

      setOrders(response.data?.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const getOrderlists = async () => {
    try {
      const orderlists = await axios.get(
        // `http://192.168.100.10:5000/orderlist/${orderId}`
        `http://192.168.1.101:5000/orderlist/${orderId}`
      )
      setOrderlists(orderlists?.data?.data)
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    getOrders()
  }, [page, status])

  const openOrderDetail = (orderDetail) => {
    setIsOrderDetail(true)
    setOrderId(orderDetail)
    onOpen()
  }

  const closeOrderDetail = async () => {
    setIsOrderDetail(false)
    onClose()
  }

  const openAddition = async (id) => {
    setIsAddition(true)
    setOrderId(id)
    onOpen()
  }

  const closeAddition = async () => {
    setIsAddition(false)
    setOrderlists([])
    onClose()
  }

  const handleFinishOrder = async (id) => {
    await finishOrder(id)
    getOrders()
    onClose()
  }

  const handleDeleteOrder = async (id) => {
    await deleteOrder(id)
    getOrders()
  }

  const handleNextPage = () => {
    setPage(prevState => prevState += 1)
    window.scrollTo(0, 0)
  }

  const handlePrevPage = () => {
    setPage(prevState => prevState -= 1)
    window.scrollTo(0, 0)
  }

  const mapOrders = orders?.map((order) => {

    return (
      <Box 
        w={isSmall? '100%' : '550px'} 
        bg='gray.100' 
        borderRadius='10px' 
        border='.5px solid gray' 
        p={5} key={order.id} 
        display="flex" 
        flexDirection="column" 
        gap="7px"
      >
        <div 
          style={{display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center"}}
        >
          <p><b>{order.client}</b></p>
          <WarningCircle 
                      size={25} 
                      style={{cursor: "pointer"}} 
                      onClick={() => openOrderDetail(order.id)}
          />
        </div>
        <p>{formattedDate(order.createdAt)}</p>
        <p>{order?.orderlist?.length} Pesanan</p>
        <div 
          style={{display: "flex", 
                  gap: "5px"}}
        >
          <Button colorScheme='green' 
                  onClick={() => openAddition(order.id)}
          >
            Addition
          </Button>
          <Button colorScheme='red' 
                  onClick={() => handleDeleteOrder(order.id)}
          >
            Cancel Order
          </Button>
        </div>
      </Box>
    )
  })

  return (
        <Box
          w='100%' 
          overflow='auto' 
          h='100%' 
          display='flex' 
          flexDirection='column' 
          gap='10px' 
          alignItems='center' 
          p='10px'
        >
          <Box 
            w='100%' 
            display='flex' 
            gap='5px'
          >
            <Button onClick={() => setStatus("processed")}>
              Processed
            </Button>
            <Button onClick={() => setStatus("pending")}>
              Pending
            </Button>
          </Box>
          {
          loading && 
            <div
              style={{width: '100%', 
                      height: "100%", 
                      display: "flex", 
                      justifyContent: "center",
                      zIndex: "10", 
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      alignItems: "center", 
                      position: "absolute", 
                      top: "0", 
                      right: "0"}}
            >
              <Spinner size={32}/>
            </div>
          }
          {mapOrders}
          {!loading && <Box
              display='flex'
              gap='5px'
          >
            <Button colorScheme='blue' onClick={() => handlePrevPage()}>Prev</Button>
            <Button colorScheme='blue' onClick={() => handleNextPage()}>Next</Button>
          </Box>
          }
          <Modal 
              isOpen={isOpen} 
              onClose={isAddition? closeAddition : closeOrderDetail}
          >
            <ModalOverlay />
            {isOrderDetail && 
              <OrderlistsDetail 
                            orderId={orderId} 
                            onClose={closeOrderDetail} 
                            action={"Finish Order"} 
                            actionFunction={handleFinishOrder}
              />
            }
            {isAddition &&
              <NewOrderList 
                        orderId={orderId} 
                        onClose={closeAddition} 
                        getOrderlists={getOrderlists}
              />}
          </Modal>
          <ToastContainer/>
        </Box>

  )
}

export default Orders