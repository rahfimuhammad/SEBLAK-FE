import React, { useContext, useState } from "react";
import axios from "axios";
import { toast, Bounce } from "react-toastify";

const OrderContext = React.createContext()

export const useOrder = () => {
    return useContext(OrderContext)
}

export const OrderProvider = ({children}) => {

    const [orderId, setOrderId] = useState()
    const [orderlistId, setOrderlistId] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const notifySuccess = (message) => toast.success(message, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      });
  const notifyError = (message) => toast.error(message, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      });

    const createOrder = async (clientName) => {
        try {
          setIsLoading(true)
          console.log(isLoading)
          const response = await axios.post('http://localhost:5000/order', {
            client: clientName
            })
          console.log(isLoading)
          setOrderId(response?.data?.data?.id)
          notifySuccess(response?.data?.message)
          setIsLoading(false)
        } catch (error) {
          console.log(error.message)
        } 
      }

    const processOrder = async (id) => {

        try {
          const response = await axios.patch(`http://localhost:5000/order/process/${id}`)
          notifySuccess(response?.data?.message)

        } catch (error) {
          notifyError(error.message)

        } finally {
          setOrderId("")
          setOrderlistId("")
        }
      }

    const finishOrder = async (id) => {
    
      try {
        const response = await axios.patch(`http://localhost:5000/order/finish/${id}`)
        notifySuccess(response?.data?.message)

      } catch (error) {
        notifyError(error.message)
      }
    }

    const createOrderAndAddItems = async (id, orderItem) => {
      try {
        const responseOrderList = await axios.post('http://localhost:5000/orderlist', {
          orderId: id,
          additional: "telor mata sapi",
          spicylevelId: 4
        });
        console.log(isLoading)
        const orderlistId = responseOrderList.data?.data?.id;
        notifySuccess(responseOrderList?.data?.message)
    
        const responsesOrderItem = await Promise.all(
          orderItem.map(async (item) => {
            try {
              const responseOrderItem = await axios.post('http://localhost:5000/orderlistitem', {
                orderlistId: orderlistId,
                productsId: item.productsId,
                qty: item.qty
              });
              return responseOrderItem.data;
            } catch (error) {
              console.error(error);
              return { error: error.message };
            }
          })
        );
    
        console.log(responsesOrderItem);
      } catch (error) {
        notifyError(error.message);
      }
    };

    const deleteOrder = async (id) => {
      try {
        const response = await axios.delete(`http://localhost:5000/order/${id}`)
        notifySuccess(response?.data?.message)

      } catch (error) {
        
        notifyError(error.message) 
      }
    }

    const value = {
        orderId,
        setOrderId,
        orderlistId,
        setOrderlistId,
        createOrder,
        createOrderAndAddItems,
        processOrder,
        finishOrder,
        deleteOrder,
        isLoading

    }

return (
    <OrderContext.Provider value={value}>
        {children}
    </OrderContext.Provider>
)
}

