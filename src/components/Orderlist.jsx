import React from 'react'
import { IsSmallScreen } from '../hooks/useSmallScreen'
import { formatCurrency } from '../function/formattedCurrency'

const Orderlist = ({ orderlist, index }) => {

  const isSmall = IsSmallScreen()


  return (
    <div style={{width: `${isSmall? "95%" : "550px"}`, borderRadius: "10px", height: "fit-content", overflow: "hidden", border: "1px solid #cccccc", paddingBottom: "10px"}} onClick={() => console.log(orderlist)}>
        <div style={{width: "100%", height: "40px", padding: "0 10px", backgroundColor: "black", color: "white", display: "flex", alignItems: "center"}}>
          <p>Pesanan {index + 1}</p>
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: "3px", padding: "10px"}}>
          {
            orderlist?.orderlistitem.map((value, index) => (
              <div key={index} style={{display: "flex", justifyContent: "space-between"}}>
                <p>{value.product.name}</p>
                <div style={{width: "50%", display: "flex", gap: "10px", justifyContent: "flex-end"}}>
                  <p>{value.qty}</p>
                  x
                  <p>{formatCurrency(value.product.price)}</p>
                </div>
              </div>
            ))
          }
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <p>Level Pedas {orderlist?.spicylevel?.level}</p>
            <p style={{width: "50%", display: "flex", justifyContent: "flex-end"}}>{formatCurrency(orderlist?.spicylevel?.price)}</p>
          </div>
          <div>
            <p>Total</p>
          </div>

        </div>
        <div style={{padding: "0 10px", display: "flex", flexDirection: "column", gap: "5px"}}>
          <p><b>Ket:</b></p>
          <p>{orderlist?.additional}</p>
        </div>
    </div>
  )
}

export default Orderlist