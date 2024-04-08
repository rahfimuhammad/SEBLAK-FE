import React, { useContext, useState } from "react";
import axios from "axios";
import { toast, Bounce } from "react-toastify";

const ProductContext = React.createContext()

export const useProduct = () => {
    return useContext(ProductContext)
}

export const ProductProvider = ({children}) => {

    const [products, setProducts] = useState([])
    const notifySuccess = (message) => toast.success(message, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
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
      theme: "dark",
      transition: Bounce,
      });

    const getProducts = async () => {
        try {
          const response = await axios.get('https://seblak-api-40223dc59db0.herokuapp.com/products')
            setProducts(response?.data?.products)
        
        } catch (error) {
          notifyError(error.message)
        }
    }

    const addProduct = async (itemName, category, price) => {
         
      try {
          const response = await axios.post('https://seblak-api-40223dc59db0.herokuapp.com/products', {
            name:itemName,
            category: category,
            price: price
          })
  
          notifySuccess(response?.data?.message)
          getProducts()
  
      } catch (error) {
          notifyError(error.message)
      }
    }

    const value = {
        getProducts,
        addProduct,
        products
    }

return (
    <ProductContext.Provider value={value}>
        {children}
    </ProductContext.Provider>
  )
}

