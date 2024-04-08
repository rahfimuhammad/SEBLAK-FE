import React, { useState, useEffect } from 'react'
import { Box, List, ListItem, NumberInputStepper, NumberDecrementStepper, NumberInput, 
         NumberIncrementStepper, NumberInputField, Text, FormControl, Input } from '@chakra-ui/react'
import { ShoppingBag } from 'phosphor-react'
import ModalElement from './ModalElement'
import { useOrder } from '../context/OrderProvider'
import { useProduct } from '../context/ProductProvider'
import { numberInputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const {
  definePartsStyle,
  defineMultiStyleConfig
} = createMultiStyleConfigHelpers(numberInputAnatomy.keys);

const xl = defineStyle({
  fontSize: "lg",
  h: "12",
  px: "2"
});

const sizes = {
  xl: definePartsStyle({ field: xl, stepper: xl, addon: xl })
};

export const numberInputTheme = defineMultiStyleConfig({ sizes });


const NewOrderList = ({ orderId, onClose, getOrderlists }) => {

    const [orderItem, setOrderItem] = useState([])
    const { createOrderAndAddItems } = useOrder()
    const { products, getProducts } = useProduct()
    const [note, setNote] = useState("")
    const [level, setLevel] = useState(1)

    useEffect(() => {
      getProducts()
    }, [])

    const handleQuantityChange = (quantity, product) => {

        let qty = parseInt(quantity);
        
        if (qty > 0) {
    
          if (!orderItem.find(item => item.productsId === product.id)) {
            setOrderItem([...orderItem, { productsId: product.id, qty: qty, productPrice: product.price }]);
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

      const handleAddItemToOrderlist = async (id) => {
          await createOrderAndAddItems(id, orderItem, level, note)
          onClose()
          getOrderlists(orderId)
      }

    const mapProducts = products?.map((product, index) => {
        return (
          <ListItem 
                display='flex' 
                gap='5px' 
                alignItems='center' 
                key={index}
          >
            <ShoppingBag size={32}/>
            <Box 
              w='100%' 
              display='flex' 
              justifyContent='space-between'
            >
              <Text>{product.name}</Text>
              <Text>{product.price}</Text>
            </Box>
            <NumberInput
                    defaultValue={0} 
                    min={0} 
                    max={20} w='100px' 
                    onChange={(valueString) => handleQuantityChange(valueString, product)}
            >
              <NumberInputField 
                    sx={numberInputTheme.sizes.xl.field}
              />
              <NumberInputStepper
                    sx={{
                      w: "fit-content",
                      h: "fit-content"}}
              >
                <NumberIncrementStepper
                  sx={{
                        fontSize: '25px'}}
                />
                <NumberDecrementStepper
                  sx={{
                    fontSize: '25px'}}
                />
              </NumberInputStepper>
            </NumberInput>
          </ListItem>
        )
      })

  return (
    <ModalElement 
              action={"Add Item"} 
              onClose={onClose} 
              actionFunction={() => handleAddItemToOrderlist(orderId)} 
              modalHeader={"Add Item"}>
      <List spacing={3}>
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
                    defaultValue={0}
                    onChange={(value) => setLevel(value)} 
                    min={1} 
                    max={5}
                    w='100px' 
          >
            <NumberInputField 
                    sx={numberInputTheme.sizes.xl.field}
            />
            <NumberInputStepper
                          sx={{
                            w: "fit-content",
                            h: "fit-content"}}
            >
              <NumberIncrementStepper
                            sx={{
                              fontSize: '25px'}}
              />
              <NumberDecrementStepper 
                            sx={{
                              fontSize: '25px'}}
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