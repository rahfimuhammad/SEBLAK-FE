import React, { useState } from 'react'
import axios from 'axios'
import { useDisclosure } from '@chakra-ui/react'
import { Box, Modal, ModalOverlay, FormControl, Button, FormLabel, Input } from '@chakra-ui/react'
import CreateOrderList from './CreateOrderList'
import Orderlist from './Orderlist'

const CreateOrder = () => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [clientName, setClientName] = useState("")
  const [orderId, setOrderId] = useState("")
  const [orderlistId, setOrderlistId] = useState("")
  const [orderlists, setOrderlists] = useState([])

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
    <div>
        <h1>Create Order</h1>
        <FormControl action="submit" maxW='400px' gap='5px'>
          <FormLabel>Nama Pemesan:</FormLabel>
          <Input value={clientName} type="text" onChange={(e) => setClientName(e.target.value)} />
          {!orderId && <Button disabled={!clientName} onClick={(e) => handleSubmit(e)} mt='5px' colorScheme='teal'>Create New Order</Button>}
        </FormControl>
          {orderId && <Box mt='5px' bg='gray.200' w='400px' h='200px' borderRadius='10px' onClick={() => createOrderList()}>Add Orderlist</Box>}
        <div>
          {orderlists.map((orderlist, index) => (
              <Orderlist key={index} orderlist={orderlist} index={index}/>
          ))}
        </div>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
            <CreateOrderList orderlistId={orderlistId} onClose={onClose} getOrderlists={getOrderlists}/>
        </Modal>
        {orderlists.length?  <Button colorScheme='teal' onClick={() => saveOrder()}>Save Order</Button> : null} 
    </div>
  )
}

export default CreateOrder