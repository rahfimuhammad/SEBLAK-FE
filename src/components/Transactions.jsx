import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Transactions = () => {

  const [finishedOrder, setFinishedOrder] = useState([])

  const getFinishedOrder = async () => {
    try {
      const res = await axios.get('http://localhost:5000/order/finishedorder/finished')
      setFinishedOrder(res?.data?.data)
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    getFinishedOrder()
  }, [])
  return (
    <div>
      <div>
        {finishedOrder?.map((value, index) => (
          <p key={index}>{value.client}</p>
        ))}
      </div>
    </div>
  )
}

export default Transactions