import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Button } from '@chakra-ui/react'
import { formattedDate } from '../function/formattedDate'

const Orders = () => {

  const [orders, setOrders] = useState([])

  const getOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/order/finishedorder/processed')

      setOrders(response.data?.data)
    } catch (error) {
      console.log(error)
    }
  }

  const finishOrder = async (orderId, client) => {
    try {
      const response = await axios.patch(`http://localhost:5000/order/${orderId}`, {
        client: client
      })

      console.log(response)
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  const mapOrders = orders?.map((order) => {
    return (
      <Box w='600px' bg='blue.100' p={10} key={order.id} display="flex" flexDirection="column" gap="7px">
        <p>{order.client}</p>
        <p>{formattedDate(order.createdAt)}</p>
        {order?.orderlist.map((or, i) => {
          return (
            <div key={i} style={{backgroundColor: "white", borderRadius: "10px", padding: "10px"}} onClick={() => console.log(or)}>
              <h5>Pesanan {i + 1}</h5>
              <p>Level {or?.spicylevel?.level}</p>
              <p>Ket: {or?.additional}</p>
              {
                or?.orderlistitem?.map((o, i) => {
                  return (
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                      <p>{o.product.name}</p>
                      <div style={{display: "flex", gap: "10px"}}>
                      <p>{o.qty}</p>
                      x
                      <p>{o.product.price}</p>
                    </div>
                    </div>
                  )
                      }) 
              }
            </div>
          )
        })}
        <Button colorScheme='teal'onClick={() => finishOrder(order.id, order.client)}>Finish Order</Button>
      </Box>
    )
  })

  return (
    <div style={{height: "calc(100vh - 20px"}}>
        <h1 onClick={() => console.log(orders)}>Orders</h1>
        <Box w='100%' overflow='auto' h='calc(100% - 24px)' display='flex' flexDirection='column' gap='30px' alignItems='center'>
          {mapOrders}
        </Box>
    </div>
  )
}

export default Orders