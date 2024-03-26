import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ModalContent, ModalCloseButton, ModalHeader, ModalFooter, ModalBody, Button } from '@chakra-ui/react'

const OrderlistsDetail = ({ orderId, onClose }) => {

  const [orderDetail, setOrderDetail] = useState([])

  const getOrderDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/orderlist/${orderId}`)
      setOrderDetail(response.data?.data)
    } catch (error) {
      console.log(error.message);      
    }
  }

  useEffect(() => {
    getOrderDetail()
  }, [orderId])

  return (
    <div>
        <ModalContent w='fit-content' maxW='98%'>
        <ModalHeader>Order Detail</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        {orderDetail?.map((or, i) => {
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
        </ModalBody>
        <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
            </Button>
        </ModalFooter>
    </ModalContent>
    </div>
  )
}

export default OrderlistsDetail