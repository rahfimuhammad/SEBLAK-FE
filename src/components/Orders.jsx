import React, { useEffect, useState } from 'react'
import { Box, Modal, ModalOverlay, Button, useDisclosure, Select } from '@chakra-ui/react'
import { formattedDate } from '../function/formattedDate'
import { IsSmallScreen } from '../function/detectSmallScreen'
import { useOrder } from '../context/OrderProvider'
import { ToastContainer } from 'react-toastify'
import { CaretLeft, CaretRight, Info } from 'phosphor-react'
import OrderlistsDetail from './OrderlistsDetail'
import NewOrderList from './NewOrderList'
import Spinner from '../elements/Spinner'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';

const Orders = () => {

  const { finishOrder, deleteOrder } = useOrder()
  const [orders, setOrders] = useState([])
  const [orderlists, setOrderlists] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(1)
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
      const response = await axios.get(`https://seblak-api-40223dc59db0.herokuapp.com/order/${status}?page=${page}`)

      setOrders(response.data?.data)
      setPageSize(response.data?.totalPages)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const getOrderlists = async () => {
    try {
      const orderlists = await axios.get(`https://seblak-api-40223dc59db0.herokuapp.com/orderlist/${orderId}`)
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
          <Info 
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
          <Button colorScheme='teal' 
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
            <Select w='fit-content' onChange={(e) => setStatus(e.target.value)}>
              <option value="processed" defaultChecked={true}>Processed</option>
              <option value="pending" defaultChecked={false}>Pending</option>
            </Select>
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
          {(!loading && orders.length > 0) && <Box
              display='flex'
              gap='5px'
          >
            <Button isDisabled={page === 1} colorScheme='gray' onClick={() => handlePrevPage()}><CaretLeft size={25}/></Button>
            <Button isDisabled={page === pageSize} colorScheme='gray' onClick={() => handleNextPage()}><CaretRight size={25}/></Button>
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