import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Box, FormControl, Input, Button } from '@chakra-ui/react'
import { formatCurrency } from "../function/formattedCurrency"

const Products = () => {

  const [products, setProducts] = useState([])
  const [itemName, setItemName] = useState("")
  const [price, setPrice] = useState("")

  const getProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products')
      setProducts(response?.data?.products)

    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
       
    try {
        const response = await axios.post('http://localhost:5000/products', {
          name: itemName,
          price: price
        })

        console.log(response?.data)
        getProducts()

    } catch (error) {
        console.log(error)
    } finally {
      
      setItemName("")
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