import React, { useState, useEffect } from 'react'
import { Box, FormControl, Input, Button, Modal, ModalOverlay } from '@chakra-ui/react'
import { formatCurrency } from "../function/formattedCurrency"
import { useProduct } from '../context/ProductProvider'
import { ToastContainer } from 'react-toastify'
import { useDisclosure } from '@chakra-ui/react'
import ModalElement from './ModalElement'

const Products = () => {

  const [itemName, setItemName] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const { getProducts, products, addProduct } = useProduct()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleAddProduct = async () => {

      await addProduct(itemName, category, price)
      onClose() 
      setItemName("")
      setCategory("")
      setPrice("")
    }

  const mapProducts = products?.map((product, index) => {
      return (
        <Box 
          w='100%' 
          display='flex' 
          justifyContent='space-between' 
          key={index}
        >
          <p>{product.name}</p>
          {/* <p>{product.category}</p> */}
          <p>{formatCurrency(product.price)}</p>
        </Box>
      )
    })

  useEffect(() => {
    getProducts()
  }, [])


  return (
    <Box 
      w='100%' 
      display='flex' 
      flexDirection='column' 
      gap='10px' 
      p='10px'
    >
      <Box 
        w='100%' 
        display='flex' 
        gap='5px'
      >
          <Button onClick={onOpen}>Add Product</Button>
          <Button>Delete Product</Button>
          <Button>Edit Product</Button>
      </Box>
      <Box w='100%'>
        {mapProducts}
      </Box>
      <Modal 
          isOpen={isOpen} 
          onClose={onClose}>
        <ModalOverlay/>
        <ModalElement 
                  modalHeader="Add Product" 
                  action="Add Product" 
                  actionFunction={handleAddProduct}
        >
          <FormControl 
                    w='100%' 
                    display='flex' 
                    flexDirection='column' gap='10px'
          >
            <Input 
                style={{color: "black"}} 
                value={itemName} 
                placeholder='Item name' 
                type="text" 
                onChange={(e) => setItemName(e.target.value) } 
            />
            <Input 
                style={{color: "black"}} 
                value={category} 
                placeholder='Category' 
                type="text" 
                onChange={(e) => setCategory(e.target.value) } 
            />
            <Input 
                color='black' 
                value={price} 
                placeholder='Item price' 
                type="number" 
                onChange={(e) => setPrice(parseInt(e.target.value)) } 
            />
          </FormControl>
        </ModalElement>
      </Modal>
      <ToastContainer/>
    </Box>
  )
}

export default Products