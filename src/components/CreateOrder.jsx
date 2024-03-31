import React, { useState } from 'react'
import axios from 'axios'
import { useOrder } from '../context/OrderProvider'
import { useDisclosure } from '@chakra-ui/react'
import { Box, ModalOverlay, Button, Modal } from '@chakra-ui/react'
import { IsSmallScreen } from '../function/detectSmallScreen'
import { PlusCircle } from 'phosphor-react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import OrderImage from "../assets/OrderImage.png"
import NewOrder from './NewOrder'
import NewOrderList from './NewOrderList'
import Orderlist from './Orderlist'
import Spinner from './Spinner'


const CreateOrder = () => {

  const { createOrder, orderId, processOrder, isLoading } = useOrder()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [clientName, setClientName] = useState("")
  const [orderlists, setOrderlists] = useState([])
  const isSmall = IsSmallScreen()

  const getOrderlists = async () => {
    try {
      const orderlists = await axios.get(`http://localhost:5000/orderlist/${orderId}`)
      setOrderlists(orderlists?.data?.data)
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleCreateOrder = async () => {
    await createOrder(clientName)
    onClose()
  }

  const handleCreateOrderlist = () => {
    onOpen()
  }

  const handleProcessOrder = async () => {
    await processOrder(orderId)
    setOrderlists([])
  }

  return (
      <>
        {orderId && 
        <Box bg='gray.200' 
             w={isSmall? '95%' : '550px'} 
             mt='10px' mb='10px' 
             h='200px' 
             borderRadius='10px' 
             display='flex' 
             justifyContent='center' 
             alignItems='center'
             onClick={handleCreateOrderlist}>
          <PlusCircle size={40} 
                      color='#5f656e'
          />
        </Box>
        }
        <div style={{display: "flex", 
                     flexDirection: "column", 
                     gap: "10px", 
                     width: "100%", 
                     alignItems: "center"}}
        >
          {orderlists.map((orderlist, index) => (
              <Orderlist key={index} orderlist={orderlist} index={index}/>
          ))}
        </div>
        {!orderId 
        &&
        <div style={{width: "100%", 
                     height: `${isSmall? "calc(100vh - 120px)" : "calc(100vh - 60px)"}`, 
                     display: "flex", 
                     justifyContent: "center", 
                     alignItems: "center"}}
        >
          <div style={{display: "flex", 
                       flexDirection: "column", 
                       gap: "10px", 
                       alignItems: "center"}}
          >
            <img src={OrderImage} 
                 alt='order' 
                 style={{width: "250px", 
                         height: "auto"}}
            />
            <Button onClick={onOpen}>
              Create Order
            </Button>
          </div>
        </div>}
        <Modal isOpen={isOpen} 
               onClose={onClose}>
          <ModalOverlay />
              {orderId
              ? <NewOrderList orderId={orderId} 
                              onClose={onClose} 
                              getOrderlists={getOrderlists} /> 
              : <NewOrder     clientName={clientName} 
                              setClientName={setClientName} 
                              onClose={onClose} 
                              actionFunction={handleCreateOrder}/>
              }
        </Modal>
        {orderlists.length
        ? <Button colorScheme='teal' 
                  mt='10px' 
                  mb='10px' 
                  onClick={handleProcessOrder}
          >
            Save Order
          </Button> 
          : null
        }
        <ToastContainer/>
      </>
  )
}

export default CreateOrder