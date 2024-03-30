import React, { useContext, useState } from "react";
import axios from "axios";

const ProductContext = React.createContext()

export const useProduct = () => {
    return useContext(ProductContext)
}

export const ProductProvider = ({children}) => {

    const [products, setProducts] = useState([])

    const getProducts = async () => {
        try {
          const response = await axios.get('http://localhost:5000/products')
            setProducts(response?.data?.products)
        
        } catch (error) {
          console.log(error)
        }
      }

    const value = {
        getProducts,
        products
    }

return (
    <ProductContext.Provider value={value}>
        {children}
    </ProductContext.Provider>
)
}

