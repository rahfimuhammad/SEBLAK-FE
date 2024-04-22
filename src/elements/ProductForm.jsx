import React, { useState } from 'react'
import { FormControl, Input, Select } from '@chakra-ui/react'
import { useProduct } from '../context/ProductProvider'
import ModalElement from './ModalElement'

const ProductForm = ({onClose, productId}) => {

    const [itemName, setItemName] = useState("")
    const [category, setCategory] = useState("")
    const [price, setPrice] = useState("")
    const { addProduct, editProduct } = useProduct()

    const handleAddProduct = async () => {

        await addProduct(itemName, category, price)
        onClose() 
        setItemName("")
        setCategory("")
        setPrice("")
    }

    const handleEditProduct = async () => {
        
        await editProduct(itemName, category, price)
        onClose() 
        setItemName("")
        setCategory("")
        setPrice("")
    }

    const actionButton = () => {
        if(productId.length) {
            handleEditProduct()
        } else {
            handleAddProduct()
        }
    }

    return (
        <>
            <ModalElement 
                    modalHeader={productId.length ? "Edit Product" : "Add Product"} 
                    action="Submit" 
                    actionFunction={actionButton}
                    onClose={onClose}
            >
                <FormControl 
                        w='100%' 
                        display='flex' 
                        flexDirection='column' gap='10px'
                >
                    <Input 
                        style={{color: "black"}} 
                        value={itemName} 
                        placeholder='Item name' 
                        type="text" 
                        onChange={(e) => setItemName(e.target.value) } 
                    />
                    <Select placeholder='Category' onChange={(e) => setCategory(e.target.value) }>
                        <option value={"Makanan"}>Makanan</option>
                        <option value={"Minuman"}>Minuman</option>
                    </Select>
                    <Input 
                        color='black' 
                        value={price} 
                        placeholder='Item price' 
                        type="number" 
                        onChange={(e) => setPrice(parseInt(e.target.value)) } 
                    />
                </FormControl>
            </ModalElement>
        </>
    )
}

export default ProductForm