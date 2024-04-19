import React from 'react'
import { IsSmallScreen } from '../function/detectSmallScreen'
import { formatCurrency } from '../function/formattedCurrency'
import { Box } from '@chakra-ui/react'
import { WarningCircle } from 'phosphor-react'

const Orderlist = ({ orderlist, index }) => {

  const isSmall = IsSmallScreen()

  return (
    <Box 
      w={isSmall? "100%" : "550px"} 
      display= 'flex' 
      flexDirection= 'column'     
      borderRadius= '10px'
      h='fit-content'
      bg='gray.100' 
      border='.5px solid gray' 
      overflow='hidden' 
      paddingBottom='10px'
    >
        <div 
          style={{width: "100%", 
                  height: "40px", 
                  padding: "0 10px", 
                  display: "flex", 
                  alignItems: "center"}}
        >
          <p><b>Pesanan {index + 1}</b></p>
        </div>
        <div 
          style={{display: "flex", 
                  flexDirection: "column", 
                  gap: "3px", 
                  padding: "10px"}}
        >
          {
            orderlist?.orderlistitem.map((value, index) => (
              <div 
                key={index} 
                style={{display: "flex", 
                        justifyContent: "space-between"}}
              >
                <p>{value.product.name}</p>
                <div 
                  style={{width: "50%", 
                          display: "flex", 
                          gap: "10px", 
                          justifyContent: "flex-end"}}
                >
                  <p>{value.qty}</p>
                  x
                  <p>{formatCurrency(value.product.price)}</p>
                </div>
              </div>
            ))
          }
          <div 
            style={{display: "flex", 
                    justifyContent: "space-between"}}
          >
            <p>Level Pedas {orderlist?.spicylevel?.level}</p>
            <p 
              style={{width: "50%", 
                      display: "flex", 
                      justifyContent: "flex-end"}}
            >
              {formatCurrency(orderlist?.spicylevel?.price)}
            </p>
          </div>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
          >
            <p><b>Subtotal:</b></p>
            <p><b>{formatCurrency(orderlist?.total)}</b></p>
          </Box>

        </div>
        {orderlist?.additional && 
        <div 
          style={{padding: "0 10px", 
                  display: "flex",
                  alignItems: "center",  
                  gap: "5px"}}
        >
          <WarningCircle size={20}/>
          <p>{orderlist?.additional}</p>
        </div>
        }
    </Box>
  )
}

export default Orderlist