import React, { useContext, useState } from "react";
import { useToast } from '@chakra-ui/react';
import axios from "axios";

const OrderContext = React.createContext()

export const useOrder = () => {
    return useContext(OrderContext)
}

export const OrderProvider = ({children}) => {

    const [orderId, setOrderId] = useState()
    const [orderlistId, setOrderlistId] = useState()
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const createOrder = async (clientName) => {
        try {
          setLoading(true)
          const response = await axios.post('https://seblak-api-40223dc59db0.herokuapp.com/order',{
            createdAt: new Date(),
            client: clientName
            })

            setOrderId(response?.data?.data?.id)
            toast({
              position: 'top',
              title: response?.data?.message,
              status: 'success',
              duration: 3000,
              isClosable: true,
          });

        } catch (error) {
          toast({
            position: 'top',
            title: error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
        } finally {
            setLoading(false)
        }
    }

    const processOrder = async (id) => {

        try {
          setLoading(true)
          const response = await axios.patch(`https://seblak-api-40223dc59db0.herokuapp.com/order/process/${id}`)
          toast({
            position: 'top',
            title: response?.data?.message,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });

        } catch (error) {
          toast({
            position: 'top',
            title: error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });

        } finally {
            setOrderId("")
            setOrderlistId("")
            setLoading(false)
        }
    }

    const finishOrder = async (id, total) => {
    
      try {
        setLoading(true)
        const response = await axios.patch(`https://seblak-api-40223dc59db0.herokuapp.com/order/finish/${id}`, {
          total: total
        })
        toast({
          position: 'top',
          title: response?.data?.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
      });

      } catch (error) {
        toast({
          position: 'top',
          title: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
      });
      } finally {
          setLoading(false)
      }
    }

    const createOrderAndAddItems = async (id, orderItem, level, levelPrice, note, totalAmount) => {
      try {
        setLoading(true)
        const responseOrderList = await axios.post('https://seblak-api-40223dc59db0.herokuapp.com/orderlist', {
          orderId: id,
          additional: note,
          spicylevelId: parseInt(level),
          spicylevelPrice: parseInt(levelPrice),
          total: totalAmount
        });

          const orderlistId = responseOrderList.data?.data?.id;
    
        await Promise.all(
          orderItem.map(async (item) => {
            try {
              const responseOrderItem = await axios.post('https://seblak-api-40223dc59db0.herokuapp.com/orderlistitem', {
                orderlistId: orderlistId,
                productsId: parseInt(item.productsId),
                productName: item.productName,
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

        toast({
          position: 'top',
          title: responseOrderList?.data?.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
      });

      } catch (error) {
        toast({
          position: 'top',
          title: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
      });
      } finally {
          setLoading(false)
      }
    };

    const deleteOrder = async (id) => {
      try {
        setLoading(true)
        const response = await axios.delete(`https://seblak-api-40223dc59db0.herokuapp.com/order/${id}`)
        toast({
          position: 'top',
          title: response?.data?.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
      });

      } catch (error) {
        toast({
          position: 'top',
          title: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
      });
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

