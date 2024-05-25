import React, { useContext, useState } from "react";
import axios from "axios";
import useLocalStorage from "../hooks/useLocalStorage"
import { useToast } from "@chakra-ui/react";

const ProductContext = React.createContext()

export const useProduct = () => {
    return useContext(ProductContext)
}

export const ProductProvider = ({children}) => {

    const [products, setProducts] = useLocalStorage('products',[])
    const [levels, setLevels] = useLocalStorage('levels', [])
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const getProducts = async () => {
        try {
          const response = await axios.get('https://seblak-api-40223dc59db0.herokuapp.com/products')
            setProducts(response?.data)
        
        } catch (error) {
          toast({
            position: 'top',
            title: error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
        }
    }

    const getLevels = async () => {
      try {
        const response = await axios.get('https://seblak-api-40223dc59db0.herokuapp.com/spicylevel')
          setLevels(response?.data?.levels)
      
      } catch (error) {
        toast({
          position: 'top',
          title: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
      });
      }
    }

    const addProduct = async (itemName, category, price) => {

      try {
          const response = await axios.post('https://seblak-api-40223dc59db0.herokuapp.com/products', {
            name:itemName,
            category: category,
            price: price
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
          getProducts()
      }
    }

    const deleteProduct = async (id) => {
      try {
        setLoading(true)
        const response = await axios.delete(`https://seblak-api-40223dc59db0.herokuapp.com/products/${id}`)
          toast({
          position: 'top',
          title: response?.data?.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
      });
          getProducts()
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

