import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Text, useDisclosure } from '@chakra-ui/react'
import { ShoppingBag } from 'phosphor-react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  List,
  ListItem,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  Box,
  FormControl,
  Button,
  FormLabel,
  Input
} from '@chakra-ui/react'

const CreateOrder = () => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [clientName, setClientName] = useState("")
  const [products, setProducts] = useState([])
  const [orderId, setOrderId] = useState("")
  const [orderlistId, setOrderlistId] = useState("")
  const [orderItem, setOrderItem] = useState([])
  const newOrder = {
    client: clientName
  }

  const createNewOrder = async () => {
    try {
      const response = await axios.post('http://localhost:5000/order',
      newOrder)
        setOrderId(response?.data?.data?.id)
    } catch (error) {
      console.log(error.message)
    }
  }

  const createOrderList = async () => {
    try {
      const response = await axios.post('http://localhost:5000/orderlist', {
        orderId: orderId
      }
    )
        setOrderlistId(response?.data?.data?.id)
    } catch (error) {
      console.log(error.message)
    }
  }
 
  const getProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products')
        setProducts(response?.data?.products)
        console.log(response)
    
    } catch (error) {
      console.log(error)
    }
  }

  const handleQuantityChange = (quantity, product) => {

    let qty = parseInt(quantity);
    
    if (qty > 0) {

      if (!orderItem.find(item => item.productsId === product.id)) {
        setOrderItem([...orderItem, { orderlistId: orderlistId, productsId: product.id, qty: qty }]);
      } else {
        setOrderItem(orderItem.map(item => {
          if (item.productsId === product.id) {
            return { ...item, qty: qty };
          }
          return item;
        }));
      }
    } else {
      setOrderItem(orderItem.filter(item => item.productsId !== product.id));
    }
  };

  const addItemToOrderlist = async (e) => {
    e.preventDefault()
      
      try {
        let responses = await Promise.all(
          orderItem.map(async (item) => {
            try {
              const response = await axios.post('http://localhost:5000/orderlistitem', {
                orderlistId: orderlistId,
                productsId: item.productsId,
                qty: item.qty
                ,
              });
              return response.data;
            } catch (error) {
              console.error(error);
              return { error: error.message };
            }
          })
        );
    
        console.log(responses);
      } catch (error) {
        console.error(error);
      }
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    
    createNewOrder()
  }
    
      const mapProducts = products?.map((product, index) => {
          return (
            <ListItem display='flex' gap='5px' alignItems='center'>
              <ShoppingBag size={32}/>
              <Box w='100%' display='flex' justifyContent='space-between'>
                <Text>{product.name}</Text>
                <Text>{product.price}</Text>
              </Box>
              <NumberInput defaultValue={0} min={0} max={20} w='100px' onChange={(valueString) => handleQuantityChange(valueString, product)}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </ListItem>
          )
        })
    
      useEffect(() => {
        getProducts()
      }, [])



  return (
    <div>
        <h1>Create Order</h1>
        <FormControl action="submit" maxW='400px' gap='5px'>
          <FormLabel>Nama Pemesan:</FormLabel>
          <Input type="text" onChange={(e) => setClientName(e.target.value)} />
          {!orderId && <Button onClick={(e) => handleSubmit(e)} mt='5px'>Create New Order</Button>}
        </FormControl>
        {orderId && <Button mt='5px' onClick={() => {onOpen(); createOrderList()}}>Add Orderlist</Button>}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent w='fit-content' maxW='98%'>
            <ModalHeader>Pilih Topping</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <List spacing={3}>
                {mapProducts}
              </List>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button onClick={(e) => addItemToOrderlist(e)} variant='ghost'>Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    </div>
  )
}

export default CreateOrder