import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ModalElement from './ModalElement'
import { WarningCircle, Fire } from 'phosphor-react'
import { Box } from '@chakra-ui/react'
import { formatCurrency } from '../function/formattedCurrency'

const OrderlistsDetail = ({ orderId, onClose, actionFunction, action }) => {

  const [orderDetail, setOrderDetail] = useState([])

  const getOrderDetail = async () => {
    try {
      const response = await axios.get(`https://seblak-api-40223dc59db0.herokuapp.com/orderlist/${orderId}`)
      setOrderDetail(response.data?.data)
    } catch (error) {
      console.log(error.message);      
    }
  }

  useEffect(() => {
    getOrderDetail()
  }, [orderId])

  return (
    <>
      <ModalElement onClose={onClose} 
                    modalHeader={"Order Detail"} 
                    action={action} 
                    actionFunction={() => actionFunction(orderId)}
      >
        {orderDetail?.map((or, i) => {
          return (
            <div 
              key={or?.id} 
              style={{backgroundColor: "white", 
                      borderRadius: "10px", 
                      padding: "10px"}}
            > 
              <div>
                <h4
                  style={{fontWeight: "500"}}
                >
                  Pesanan {i + 1}</h4>
              </div>
              {
                or?.orderlistitem?.map((o, i) => {
                  return (
                    <div
                      key={i} 
                      style={{display: "flex", 
                              justifyContent: "space-between"}}
                    >
                      <p>{o.product.name}</p>
                      <div 
                        style={{display: "flex", 
                                gap: "10px"}}
                      >
                        <p>{o.qty}</p>
                        x
                        <p>{formatCurrency(o.product.price)}</p>
                      </div>
                    </div>
                  )
                }) 
              }
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
              >
                <Box
                  display='flex'
                  gap='5px'
                  alignItems='center' 
                >
                  <Fire size={20}/>
                  <p>Level {or?.spicylevel?.level}</p>
                </Box>
                <p>{formatCurrency(or?.spicylevel?.price)}</p>
              </Box>
              <Box
                mt='5px'
                display='flex'
                justifyContent='space-between'
              >
                <p><b>Subtotal: </b></p>
                <p>Rp. 12.500,00</p>
              </Box>
              <Box
                mt='5px'
                display='flex'
                w='100%'
                gap='5px'
                alignItems='flex-start' 
              >
                <WarningCircle size={20}/>
                <p
                  style={{maxWidth: "calc(100% - 25px)"}}
                >{or?.additional}</p>
              </Box>
            </div>
          )
        })}
      </ModalElement>
    </>
  )
}

export default OrderlistsDetail