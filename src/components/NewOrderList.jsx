import React, { useState, useEffect } from 'react'
import { Box, List, ListItem, NumberInputStepper, NumberDecrementStepper, NumberInput, 
        NumberIncrementStepper, NumberInputField, Text, FormControl, Input, 
        Button} from '@chakra-ui/react'
import { ShoppingBag } from 'phosphor-react'
import { useOrder } from '../context/OrderProvider'
import { useProduct } from '../context/ProductProvider'
import { numberInputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";
import ModalElement from '../elements/ModalElement'

const {
  definePartsStyle,
  defineMultiStyleConfig
} = createMultiStyleConfigHelpers(numberInputAnatomy.keys);

const xl = defineStyle({
  fontSize: "lg",
  h: "10",
  px: "2"
});

const sizes = {
  xl: definePartsStyle({ field: xl, stepper: xl, addon: xl })
};

export const numberInputTheme = defineMultiStyleConfig({ sizes });


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
    }, [])

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
                        fontSize: '18px'}}
                />
                <NumberDecrementStepper
                  sx={{
                    fontSize: '18px'}}
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
      <List spacing={3}>
        {mapProducts}
      </List>
      <Button onClick={() => console.log(totalAmount)}>Test</Button>
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
                    onChange={(value) => onChangeLevel(value)} 
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
                              fontSize: '18px'}}
              />
              <NumberDecrementStepper 
                            sx={{
                              fontSize: '18px'}}
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