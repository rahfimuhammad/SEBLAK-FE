import React from 'react'

const Orderlist = ({ orderlist }) => {
  return (
    <div style={{backgroundColor: "gray", width: "400px", height: "200px"}}>
        <p>{orderlist.id}</p>
    </div>
  )
}

export default Orderlist