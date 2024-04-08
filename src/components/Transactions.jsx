import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Box } from '@chakra-ui/react'
import { WarningCircle } from 'phosphor-react'
import { formattedDate } from '../function/formattedDate'
import { IsSmallScreen } from '../function/detectSmallScreen'
import { useDisclosure } from '@chakra-ui/react'
import { Modal, ModalOverlay, Button } from '@chakra-ui/react'
import OrderlistsDetail from './OrderlistsDetail'
import Spinner from './Spinner'

const Transactions = () => {

  const [finishedOrder, setFinishedOrder] = useState([])
  const [orderId, setOrderId] = useState()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isSmall = IsSmallScreen()

  const getFinishedOrder = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        // `http://192.168.100.10:5000/order/finishedorder/finished?page=${page}`
        // `http://192.168.1.101:5000/order/finishedorder/finished?page=${page}`
        `https://seblak-api-40223dc59db0.herokuapp.com/order/finishedorder/finished?page=${page}`
      )
      setFinishedOrder(res?.data?.data)
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getFinishedOrder()
  }, [page])

  const openOrderDetail = (orderId) => {
    setOrderId(orderId)
    onOpen()
  }

  const handleNextPage = () => {
    setPage(prevState => prevState += 1)
    window.scrollTo(0, 0)
  }

  const handlePrevPage = () => {
    setPage(prevState => prevState -= 1)
    window.scrollTo(0, 0)
  }

  return (
    <Box 
      w='100%' 
      overflow='auto' 
      h='100%' display='flex' 
      flexDirection='column' 
      gap='10px' 
      alignItems='center' 
      p='10px 0'
    >
      {
        loading && 
          <div 
            style={{width: '100%', 
                    height: "100%",
                    zIndex: "10",
                    position: "absolute",
                    top: "0",
                    left: "0", 
                    backgroundColor: "rgba(0, 0, 0, 0.3)", 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center"}}
          >
            <Spinner size={32}/>
          </div>
      }
      {finishedOrder?.map((value) => (
        <Box 
          w={isSmall? '95%' : '550px'} 
          bg='gray.100' 
          borderRadius='10px' 
          border='.5px solid gray' 
          p={5} key={value.id} display="flex" 
          flexDirection="column" 
          gap="7px"
        >
          <div 
            style={{display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center"}}
          >
            <p><b>{value.client}</b></p>
            <WarningCircle 
                      size={25} 
                      style={{cursor: "pointer"}} 
                      onClick={() => openOrderDetail(value.id)}
            />
          </div>
          <p>{formattedDate(value.createdAt)}</p>
          <p>{value?.orderlist?.length} Pesanan</p>
        </Box>
        ))}
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
            onClose={onClose}
        >
          <ModalOverlay />
          <OrderlistsDetail 
                        orderId={orderId} 
                        onClose={onClose} 
                        action={""}
          />
        </Modal>
    </Box>
  )
}

export default Transactions