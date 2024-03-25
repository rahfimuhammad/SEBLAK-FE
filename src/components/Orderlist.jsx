import React from 'react'

const Orderlist = ({ orderlist, index }) => {

  return (
    <div style={{backgroundColor: "gray", width: "400px", height: "200px"}} onClick={() => console.log(orderlist)}>
        <p>Pesanan {index + 1}</p>
        <p>Level Pedas {orderlist?.spicylevel?.level}</p>
        <p>Ket: {orderlist?.additional}</p>
        <div>
          {
            orderlist?.orderlistitem.map((value, index) => (
              <div key={index}>
                <p>{value.product.name}</p>
                <p>{value.product.price}</p>
                <p>{value.qty}</p>
              </div>
            ))
          }
        </div>
    </div>
  )
}

export default Orderlist