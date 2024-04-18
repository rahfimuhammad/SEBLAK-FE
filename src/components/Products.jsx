import React, { useState, useEffect } from 'react'
import { Box, FormControl, Input, Button, Modal, ModalOverlay, TableContainer, Table, Thead, Tbody, Tr, Th, Td, Select } from '@chakra-ui/react'
import { formatCurrency } from "../function/formattedCurrency"
import { IsSmallScreen } from '../function/detectSmallScreen'
import { useProduct } from '../context/ProductProvider'
import { ToastContainer } from 'react-toastify'
import { useDisclosure } from '@chakra-ui/react'
import ModalElement from '../elements/ModalElement'
import { PencilSimple, Trash } from 'phosphor-react'

const Products = () => {

  const [itemName, setItemName] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const { getProducts, products, addProduct, deleteProduct } = useProduct()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleAddProduct = async () => {

      await addProduct(itemName, category, price)
      onClose() 
      setItemName("")
      setCategory("")
      setPrice("")
    }

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id)
  }

  const mapProducts = products?.map((product, index) => {
      return (
        <Tr key={index}>
            <Td whiteSpace= 'nowrap' overflow='auto'>{product.name}</Td>
            <Td whiteSpace= 'nowrap' overflow='auto'>{product.category}</Td>
            <Td whiteSpace= 'nowrap' overflow='auto'>{formatCurrency(product.price)}</Td>
            <Td
              display='flex'
              alignItems='center'
              gap='5px'
            >
                <Button size='sm' colorScheme='teal'>
                    <PencilSimple size={20}/>
                </Button>
                <Button size='sm' colorScheme='red'>
                    <Trash size={20} onClick={() => handleDeleteProduct(product.id)}/>
                </Button>
            </Td>
        </Tr>
      )
    })

  useEffect(() => {
    getProducts()
  }, [])


  return (
    <Box 
      w='100%' 
      display='flex' 
      flexDirection='column' 
      gap='10px' 
      p='10px'
    >
      <Box 
        w='100%' 
        display='flex' 
        gap='5px'
      >
          <Button colorScheme='teal' onClick={onOpen}>Add Product</Button>
          <Select w='fit-content'>
            <option>Makanan</option>
            <option>Minuman</option>
          </Select>
      </Box>
      <Box w='100%'>
        <TableContainer borderWidth="1px" w='100%' overflowX="auto" whiteSpace='collapse'>
            <Table size={IsSmallScreen? "sm" : "md"} w='100%'>
                <Thead>
                    <Tr>
                        <Th paddingY={3}>Name</Th>
                        <Th>Category</Th>
                        <Th>Price</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {mapProducts}
                </Tbody>
            </Table>
        </TableContainer>
      </Box>
      <Modal 
          isOpen={isOpen} 
          onClose={onClose}>
        <ModalOverlay/>
        <ModalElement 
                  modalHeader="Add Product" 
                  action="Add Product" 
                  actionFunction={handleAddProduct}
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
      </Modal>
      <ToastContainer/>
    </Box>
  )
}

export default Products