import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Box, ModalContent, ModalHeader, ModalCloseButton, ModalFooter, ModalBody, List, 
         ListItem, NumberInputStepper, NumberDecrementStepper, NumberIncrementStepper, 
         NumberInput, NumberInputField, Button, Text } from '@chakra-ui/react'
import { ShoppingBag } from 'phosphor-react'

const CreateOrderList = ({ orderlistId, onClose, getOrderlists }) => {

    const [products, setProducts] = useState([])
    const [orderItem, setOrderItem] = useState([])

    const getProducts = async () => {
        try {
          const response = await axios.get('http://localhost:5000/products')
            setProducts(response?.data?.products)
        
        } catch (error) {
          console.log(error)
        }
      }

    useEffect(() => {
        getProducts()
    }, [])

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
              getOrderlists()
              onClose()
            console.log(responses);
          } catch (error) {
            console.error(error);
          }
      };

    const mapProducts = products?.map((product, index) => {
        return (
          <ListItem display='flex' gap='5px' alignItems='center' key={index}>
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

  return (
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
            <Button onClick={(e) => addItemToOrderlist(e)} variant='ghost'>Create Orderlist</Button>
        </ModalFooter>
    </ModalContent>
  )
}

export default CreateOrderList