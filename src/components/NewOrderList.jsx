import React, { useState, useEffect } from 'react'
import { Box, List, ListItem, NumberInputStepper, NumberDecrementStepper, NumberInput, 
        NumberIncrementStepper, NumberInputField, Text, FormControl, Input, } from '@chakra-ui/react'
import { useOrder } from '../context/OrderProvider'
import { useProduct } from '../context/ProductProvider'
import ModalElement from '../elements/ModalElement'

const NewOrderList = ({ orderId, onClose, getOrderlists }) => {

    const [orderItem, setOrderItem] = useState([])
    const { createOrderAndAddItems } = useOrder()
    const { products, getProducts, levels, getLevels } = useProduct()
    const [levelPrice, setLevelPrice] = useState(0)
    const [note, setNote] = useState("")
    const [level, setLevel] = useState(1)

    useEffect(() => {

      const getMenu = async () => {
        await getProducts()
        getLevels()
      }

      if(!products.length && !levels.length) {
        getMenu()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products])

    const handleQuantityChange = (quantity, product) => {

        let qty = parseInt(quantity);
        
        if (qty > 0) {
    
          if (!orderItem.find(item => item.productsId === product.id)) {
            
            setOrderItem([...orderItem, { productsId: product.id, 
                                          qty: qty, 
                                          productName: product.name, 
                                          productPrice: product.price 
                                        }]);
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

      const onChangeLevel = (value) => {
        setLevel(value)
        setLevelPrice(levels[value - 1]?.price)
    }

      const handleAddItemToOrderlist = async (id, totalAmount) => {
          await createOrderAndAddItems(id, orderItem, level, levelPrice, note, totalAmount)
          onClose()
          getOrderlists(orderId)
          setLevel(1)
    }

    const mapProducts = products?.map((product, index) => {
        return (
          <ListItem 
                display='flex' 
                gap='8px' 
                alignItems='center' 
                key={index}
          >
            <Box 
              w='100%' 
              display='flex' 
              justifyContent='space-between'
            >
              <Text>{product.name}</Text>
              <Text>{product.price}</Text>
            </Box>
            <NumberInput
                    size='lg'
                    defaultValue={0} 
                    min={0} 
                    max={20} w='100px' 
                    onChange={(valueString) => handleQuantityChange(valueString, product)}
                    focusInputOnChange={false}
            >
              <NumberInputField 
                    readOnly
                    tabIndex={-1}
              />
              <NumberInputStepper>
                <NumberIncrementStepper
                  sx={{
                        fontSize: '22px'}}
                />
                <NumberDecrementStepper
                  sx={{
                    fontSize: '22px'}}
                />
              </NumberInputStepper>
            </NumberInput>
          </ListItem>
        )
    })

    const subTotal = orderItem.reduce((total, item) => total + item.qty * item.productPrice, 0)
    const totalAmount = subTotal + levelPrice

  return (
    <ModalElement 
              action={"Add Item"} 
              onClose={onClose} 
              actionFunction={() => handleAddItemToOrderlist(orderId, totalAmount)} 
              modalHeader={"Add Item"}>
      <List spacing={4}>
        {mapProducts}
      </List>
      <FormControl
              mt='10px'
              display='flex'
              flexDirection='column'
              gap='5px'  
      >
        <Input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder='Notes'/>
        <Box
          display='flex'
          gap='10px'
          alignItems='center'
        >
          <NumberInput 
                    size='lg'
                    defaultValue={0}
                    onChange={(value) => onChangeLevel(value)}
                    focusInputOnChange={false} 
                    min={1} 
                    max={5}
                    w='100px'
          >
            <NumberInputField 
                    readOnly
                    tabIndex={-1}
            />
            <NumberInputStepper>
              <NumberIncrementStepper
                            sx={{
                              fontSize: '22px'}}
              />
              <NumberDecrementStepper 
                            sx={{
                              fontSize: '22px'}}
              />
            </NumberInputStepper>
          </NumberInput>
          <Text
              fontWeight='bold'
          >
            Spicy Level
          </Text>
        </Box>
      </FormControl>
    </ModalElement>
  )
}

export default NewOrderList