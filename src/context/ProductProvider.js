import React, { useContext, useState } from "react";
import axios from "axios";
import { toast, Bounce } from "react-toastify";
import useLocalStorage from "../hooks/useLocalStorage";

const ProductContext = React.createContext()

export const useProduct = () => {
    return useContext(ProductContext)
}

export const ProductProvider = ({children}) => {

    const [products, setProducts] = useLocalStorage("products", [])
    const [levels, setLevels] = useLocalStorage("levels", [])
    const [loading, setLoading] = useState(false)
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
            setProducts(response?.data)
        
        } catch (error) {
          notifyError(error.message)
        }
    }

    const getLevels = async () => {
      try {
        const response = await axios.get('https://seblak-api-40223dc59db0.herokuapp.com/spicylevel')
          setLevels(response?.data?.levels)
      
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

    const deleteProduct = async (id) => {
      try {
        setLoading(true)
        const response = await axios.delete(`https://seblak-api-40223dc59db0.herokuapp.com/product/${id}`)
          notifySuccess(response?.data?.message)
          getProducts()
      } catch (error) {
        notifyError(error.message)
      } finally {
        setLoading(false)
      }
    }

    const value = {
        getProducts,
        addProduct,
        products,
        getLevels,
        levels,
        loading, 
        deleteProduct
    }

return (
    <ProductContext.Provider value={value}>
        {children}
    </ProductContext.Provider>
  )
}

