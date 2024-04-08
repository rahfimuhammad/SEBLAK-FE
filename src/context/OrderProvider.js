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
    const [loading, setLoading] = useState(false)
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
          setLoading(true)
          const response = await axios.post('https://seblak-api-40223dc59db0.herokuapp.com/order',{
            client: clientName
            })
          console.log(loading)
          setOrderId(response?.data?.data?.id)
          notifySuccess(response?.data?.message)
        } catch (error) {
          console.log(error.message)
        } finally {
          setLoading(false)
        }
      }

    const processOrder = async (id) => {

        try {
          setLoading(true)
          const response = await axios.patch(`https://seblak-api-40223dc59db0.herokuapp.com/order/process/${id}`)
          notifySuccess(response?.data?.message)

        } catch (error) {
          notifyError(error.message)

        } finally {
          setOrderId("")
          setOrderlistId("")
          setLoading(false)
        }
      }

    const finishOrder = async (id) => {
    
      try {
        setLoading(true)
        const response = await axios.patch(`https://seblak-api-40223dc59db0.herokuapp.com/order/finish/${id}`)
        notifySuccess(response?.data?.message)

      } catch (error) {
        notifyError(error.message)
      } finally {
        setLoading(false)
      }
    }

    const createOrderAndAddItems = async (id, orderItem, level, note) => {
      try {
        setLoading(true)
        const responseOrderList = await axios.post('https://seblak-api-40223dc59db0.herokuapp.com/orderlist', {
          orderId: id,
          additional: note,
          spicylevelId: parseInt(level)
        });

        const orderlistId = responseOrderList.data?.data?.id;
        notifySuccess(responseOrderList?.data?.message)
    
        await Promise.all(
          orderItem.map(async (item) => {
            try {
              const responseOrderItem = await axios.post('https://seblak-api-40223dc59db0.herokuapp.com/orderlistitem',{
                orderlistId: orderlistId,
                productsId: item.productsId,
                productPrice: item.productPrice,
                qty: item.qty
              });
              return responseOrderItem.data;
            } catch (error) {
              console.error(error);
              return { error: error.message };
            }
          })
        );

      } catch (error) {
        notifyError(error.message);
      } finally {
        setLoading(false)
      }
    };

    const deleteOrder = async (id) => {
      try {
        setLoading(true)
        const response = await axios.delete(`https://seblak-api-40223dc59db0.herokuapp.com/order/${id}`)
        notifySuccess(response?.data?.message)

      } catch (error) {
        notifyError(error.message) 
      } finally {
        setLoading(false)
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
        loading

    }

return (
    <OrderContext.Provider value={value}>
        {children}
    </OrderContext.Provider>
  )
}

