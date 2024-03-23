import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Products = () => {

  const [products, setProducts] = useState([])
  const [itemName, setItemName] = useState("")
  const [price, setPrice] = useState("")

  const getProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products')
      setProducts(response?.data?.products)
      console.log(response)

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
        <div>
          <p>{product.name}</p>
          <p>{product.price}</p>
        </div>
      )
    })

  useEffect(() => {
    getProducts()
  }, [])


  return (
    <div>
        <h1>Products</h1>
        <div>
          {mapProducts}
        </div>
        <form onSubmit={handleSubmit}>
          <input style={{color: "black"}} value={itemName} placeholder='item name' type="text" onChange={(e) => setItemName(e.target.value) } />
          <input style={{color: "black"}} value={price} placeholder='price' type="number" onChange={(e) => setPrice(parseInt(e.target.value)) } />
          <button>SAVE</button>
        </form>
    </div>
  )
}

export default Products