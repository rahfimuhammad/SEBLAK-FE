import React, { useContext, useState } from "react";
import axios from "axios";

const OrderContext = React.createContext()

export const useOrder = () => {
    return useContext(OrderContext)
}

export const OrderProvider = ({children}) => {

    const [orderId, setOrderId] = useState()
    const [orderlistId, setOrderlistId] = useState()
    const [orderlists, setOrderlists] = useState([])

    const createOrder = async (clientName) => {
        try {
          const response = await axios.post('http://localhost:5000/order', {
            client: clientName
            }
          )
            setOrderId(response?.data?.data?.id)
        } catch (error) {
          console.log(error.message)
        }
      }

    // const createOrderList = async (id) => {
    //     try {
    //       const response = await axios.post('http://localhost:5000/orderlist', {
    //         orderId: id,
    //         additional: "telor mata sapi",
    //         spicylevelId: 4
    //         }
    //       )
    //         setOrderlistId(response?.data?.data?.id)
    //     } catch (error) {
    //       console.log(error.message)
    //     }
    //   }

    const processOrder = async (clientName, id) => {

        try {
          const response = await axios.patch(`http://localhost:5000/order/process/${id}`, {
            client: clientName
          })
        } catch (error) {
          console.log(error.message)
        } finally {
          setOrderId("")
          setOrderlistId("")
          setOrderlists([])
        }
      }

      const finishOrder = async (id, client) => {
    
        try {
          const response = await axios.patch(`http://localhost:5000/order/finish/${id}`, {
            client: client
          })
    
          console.log(response)
        } catch (error) {
          console.log(error.message)
        }
      }

    //   const addItemToOrderlist = async (orderItem, orderlistId) => {
          
    //     try {
    //       let responses = await Promise.all(
    //         orderItem.map(async (item) => {
    //           try {
    //             const response = await axios.post('http://localhost:5000/orderlistitem', {
    //               orderlistId: orderlistId,
    //               productsId: item.productsId,
    //               qty: item.qty
    //               ,
    //             });
    //             return response.data;
    //           } catch (error) {
    //             console.error(error);
    //             return { error: error.message };
    //           }
    //         })
    //       );
    //       console.log(responses);
    //     } catch (error) {
    //       console.error(error);
    //     }
    // };

    const createOrderAndAddItems = async (orderItem) => {
      try {
        const responseOrderList = await axios.post('http://localhost:5000/orderlist', {
          orderId: orderId,
          additional: "telor mata sapi",
          spicylevelId: 4
        });
        const orderlistId = responseOrderList.data?.data?.id;
    
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
        console.error(error);
      }
    };
    

    const getOrderlists = async () => {

        try {
          const orderlists = await axios.get(`http://localhost:5000/orderlist/${orderId}`)
          setOrderlists(orderlists?.data?.data)
        } catch (error) {
          console.log(error.message)
        }
      }

    const value = {
        orderId,
        setOrderId,
        orderlistId,
        setOrderlistId,
        createOrder,
        // createOrderList,
        createOrderAndAddItems,
        processOrder,
        // addItemToOrderlist,
        orderlists,
        getOrderlists,
        finishOrder

    }

return (
    <OrderContext.Provider value={value}>
        {children}
    </OrderContext.Provider>
)
}

