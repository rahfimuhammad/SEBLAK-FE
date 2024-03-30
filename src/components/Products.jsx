import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Box, FormControl, Input, Button } from '@chakra-ui/react'
import { formatCurrency } from "../function/formattedCurrency"
import { useProduct } from '../context/ProductProvider'

const Products = () => {

  const [itemName, setItemName] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const { getProducts, products } = useProduct()

  const handleSubmit = async (e) => {
    e.preventDefault()
       
    try {
        const response = await axios.post('http://localhost:5000/products', {
          name: itemName,
          category: category,
          price: price
        })

        console.log(response?.data)
        getProducts()

    } catch (error) {
        console.log(error)
    } finally {
      
      setItemName("")
      setCategory("")
      setPrice("")
    }

  }

  const mapProducts = products?.map((product, index) => {
      return (
        <Box w='100%' display='flex' justifyContent='space-between' key={index}>
          <p>{product.name}</p>
          <p>{formatCurrency(product.price)}</p>
        </Box>
      )
    })

  useEffect(() => {
    getProducts()
  }, [])


  return (
    <Box w='100%' display='flex' gap='20px'>
        <FormControl w='40%' display='flex' flexDirection='column' gap='10px'>
          <Input style={{color: "black"}} value={itemName} placeholder='Item name' type="text" onChange={(e) => setItemName(e.target.value) } />
          <Input style={{color: "black"}} value={category} placeholder='Category' type="text" onChange={(e) => setCategory(e.target.value) } />
          <Input style={{color: "black"}} value={price} placeholder='Item price' type="number" onChange={(e) => setPrice(parseInt(e.target.value)) } />
          <Button onClick={(e) => handleSubmit(e)} type='submit' colorScheme='teal'>SAVE</Button>
        </FormControl>
        <Box w='60%'>
          {mapProducts}
        </Box>
    </Box>
  )
}

export default Products