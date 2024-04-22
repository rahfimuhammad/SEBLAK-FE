import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Box } from '@chakra-ui/react'
import { CaretLeft, CaretRight, Info } from 'phosphor-react'
import { formattedDate } from '../function/formattedDate'
import { IsSmallScreen } from '../function/detectSmallScreen'
import { useDisclosure, Modal, ModalOverlay, Button } from '@chakra-ui/react'
import OrderlistsDetail from './OrderlistsDetail'
import Spinner from '../elements/Spinner'

const Transactions = () => {

  const [finishedOrder, setFinishedOrder] = useState([])
  const [orderId, setOrderId] = useState()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(1)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isSmall = IsSmallScreen()

  const getFinishedOrder = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`https://seblak-api-40223dc59db0.herokuapp.com/order/finished?page=${page}`)
      
      setFinishedOrder(res?.data?.data)
      setPageSize(res?.data?.totalPages)
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getFinishedOrder()
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <Info 
                      size={25} 
                      style={{cursor: "pointer"}} 
                      onClick={() => openOrderDetail(value.id)}
            />
          </div>
          <p>{formattedDate(value.createdAt)}</p>
          <p>{value?.orderlist?.length} Pesanan</p>
        </Box>
        ))}
        {(!loading && finishedOrder?.length > 0) 
        && <Box
            display='flex'
            gap='5px'
        >
          <Button isDisabled={page === 1} colorScheme='gray' onClick={() => handlePrevPage()}><CaretLeft size={25}/></Button>
          <Button isDisabled={page === pageSize} colorScheme='gray' onClick={() => handleNextPage()}><CaretRight size={25}/></Button>
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