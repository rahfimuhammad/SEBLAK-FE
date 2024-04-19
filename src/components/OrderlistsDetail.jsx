import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ModalElement from '../elements/ModalElement'
import Spinner from '../elements/Spinner'
import { Info, Fire } from 'phosphor-react'
import { Box } from '@chakra-ui/react'
import { formatCurrency } from '../function/formattedCurrency'

const OrderlistsDetail = ({ orderId, onClose, actionFunction, action }) => {

  const [orderDetail, setOrderDetail] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    const getOrderDetail = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`https://seblak-api-40223dc59db0.herokuapp.com/orderlist/${orderId}`)
          setOrderDetail(response.data?.data)
      } catch (error) {
          console.log(error.message);      
      } finally {
          setLoading(false)
      }
    }

    getOrderDetail()

  }, [orderId])

  const totalAmount = orderDetail?.reduce((acc, curr) => {
    return acc + curr?.total
  }, 0)


  return (
    <>
      <ModalElement onClose={onClose} 
                    modalHeader={"Order Detail"} 
                    action={action} 
                    actionFunction={() => actionFunction(orderId, totalAmount)}
      >
        {loading && 
        <Box w='100%' height='100%' display='flex' justifyContent='center' alignItems='center'>
          <Spinner size={32} />
        </Box>
        }
        {orderDetail?.map((orderlist, index) => {
          return (
            <div 
              key={orderlist?.id} 
              style={{backgroundColor: "white", 
                      borderRadius: "10px", 
                      padding: "10px"}}
            > 
              <div>
                <h4
                  style={{fontWeight: "500"}}
                >
                  Pesanan {index + 1}</h4>
              </div>
              {
                orderlist?.orderlistitem?.map((item, index) => {
                  return (
                    <div
                      key={index} 
                      style={{display: "flex", 
                              justifyContent: "space-between"}}
                    >
                      <p>{item.productName}</p>
                      <div 
                        style={{display: "flex", 
                                gap: "10px"}}
                      >
                        <p>{item.qty}</p>
                        x
                        <p>{formatCurrency(item.productPrice)}</p>
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
                  <Fire size={25}/>
                  <p>Level {orderlist?.spicylevel?.level}</p>
                </Box>
                <p>{formatCurrency(orderlist?.spicylevelPrice)}</p>
              </Box>
              <Box
                mt='5px'
                display='flex'
                justifyContent='space-between'
              >
                <p><b>Subtotal: </b></p>
                <p><b>{formatCurrency(orderlist?.total)}</b></p>
              </Box>
              {orderlist?.additional &&
                <Box
                mt='5px'
                display='flex'
                w='100%'
                gap='5px'
                alignItems='flex-start' 
              >
                <Info size={25}/>
                <p
                  style={{maxWidth: "calc(100% - 25px)"}}
                >{orderlist?.additional}</p>
              </Box>
              }
            </div>
          )
        })}
        {!loading && 
        <Box 
          p='10px' 
          display='flex' 
          justifyContent='space-between' 
          alignItems='center'
          borderTop='1px solid black'
        >
            <p><b>Total:</b></p>
            <p><b>{formatCurrency(totalAmount)}</b></p>
        </Box>
        }
      </ModalElement>
    </>
  )
}

export default OrderlistsDetail