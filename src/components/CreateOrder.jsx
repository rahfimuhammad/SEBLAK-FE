import React, { useState } from 'react'
import axios from 'axios'
import { useDisclosure } from '@chakra-ui/react'
import { Box, Modal, ModalOverlay, FormControl, Button, FormLabel, Input } from '@chakra-ui/react'
import CreateOrderList from './CreateOrderList'
import Orderlist from './Orderlist'
import { IsSmallScreen } from '../hooks/useSmallScreen'

const CreateOrder = () => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [clientName, setClientName] = useState("")
  const [orderId, setOrderId] = useState("")
  const [orderlistId, setOrderlistId] = useState("")
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

  const createNewOrder = async () => {
    try {
      const response = await axios.post('http://localhost:5000/order', {
        client: clientName
        }
      )
        setOrderId(response?.data?.data?.id)
    } catch (error) {
      console.log(error.message)
    }
  }

  const createOrderList = async () => {
    try {
      onOpen()
      const response = await axios.post('http://localhost:5000/orderlist', {
        orderId: orderId,
        additional: "telor mata sapi",
        spicylevelId: 4
        }
      )
        setOrderlistId(response?.data?.data?.id)
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    createNewOrder()
  }

  const saveOrder = () => {
    setClientName("")
    setOrderId("")
    setOrderlistId("")
    setOrderlists([])
  }

  return (
    <>
        <FormControl action="submit" w={isSmall? '95%' : '550px'} gap='5px' display='flex' alignItems='center'>
          <Input w='60%' placeholder='Nama Pemesan' value={clientName} type="text" onChange={(e) => setClientName(e.target.value)} />
          <Button w='40%' isDisabled={!clientName || orderId} onClick={(e) => handleSubmit(e)} colorScheme='teal' padding='10px'>Create New Order</Button>
        </FormControl>
          {orderId && <Box bg='gray.200' w={isSmall? '95%' : '550px'} h='200px' borderRadius='10px' onClick={() => createOrderList()}>Add Orderlist</Box>}
        <div style={{display: "flex", flexDirection: "column", gap: "10px", width: "100%", alignItems: "center"}}>
          {orderlists.map((orderlist, index) => (
              <Orderlist key={index} orderlist={orderlist} index={index}/>
          ))}
        </div>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
            <CreateOrderList orderlistId={orderlistId} onClose={onClose} getOrderlists={getOrderlists}/>
        </Modal>
        {orderlists.length?  <Button colorScheme='teal' onClick={() => saveOrder()}>Save Order</Button> : null} 
    </>
  )
}

export default CreateOrder