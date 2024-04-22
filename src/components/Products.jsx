import React, { useEffect, useState } from 'react'
import { Box, Button, Modal, ModalOverlay, TableContainer, Table, Thead, Tbody, Tr, Th, Td, Select } from '@chakra-ui/react'
import { formatCurrency } from "../function/formattedCurrency"
import { IsSmallScreen } from '../function/detectSmallScreen'
import { useProduct } from '../context/ProductProvider'
import { ToastContainer } from 'react-toastify'
import { useDisclosure } from '@chakra-ui/react'
import { PencilSimple, Trash } from 'phosphor-react'
import ProductForm from '../elements/ProductForm'
import DeleteForm from '../elements/DeleteForm'

const Products = () => {

  const { getProducts, products, getLevels } = useProduct()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [category, setCategory] = useState("Makanan")
  const [filtered, setFiltered] = useState([])
  const [isDelete, setIsDelete] = useState(false)
  const [isForm, setIsForm] = useState(false)
  const [productId, setProductId] = useState("")
  const { deleteProduct } = useProduct()

  const handleDeleteProduct = async () => {
      
      await deleteProduct(productId)
  }

  const onModalDelete = (id) => {
    setProductId(id)
    setIsDelete(true)
    setIsForm(false)
    onOpen()
  }
  
  const onModalForm = (id) => {
    setProductId(id)
    setIsForm(true)
    setIsDelete(false)
    onOpen()
  }

  useEffect(() => {
    const filterProducts = () => {
      const filteredProducts = products?.filter(product => product.category === category);
      setFiltered(filteredProducts);
    }
  
    filterProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, products]);
  
  const mapProducts = filtered?.map((product, index) => {
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
                <Button 
                    size='sm' 
                    colorScheme='teal'
                    onClick={() => onModalForm(product.id)}
                >
                    <PencilSimple size={20}/>
                </Button>
                <Button 
                    size='sm' 
                    colorScheme='red' 
                    onClick={() => onModalDelete(product.id)}
                >
                    <Trash size={20}/>
                </Button>
            </Td>
        </Tr>
      )
    })

    const getMenu = async () => {
      await getProducts()
      getLevels()
    }

  useEffect(() => {
    if(!products.length) {
      getMenu()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <Box 
      w='100%' 
      display='flex' 
      flexDirection='column'
      alignItems='center' 
      gap='10px' 
      p='10px'
    >
      <Box 
        w='100%' 
        display='flex' 
        gap='5px'
      >
          <Button colorScheme='teal' onClick={onModalForm}>Add Product</Button>
          <Select w='fit-content' onChange={(e) => setCategory(e.target.value)}>
            <option value={"Makanan"}>Makanan</option>
            <option value={"Minuman"}>Minuman</option>
          </Select>
          <Button onClick={() => getMenu()}>Refetch</Button>
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
          {
          isForm ? 
          <ProductForm 
                  onClose={onClose} 
                  productId={productId}
          /> : 
          isDelete ? 
          <DeleteForm 
                  onClose={onClose}
                  actionFunction={handleDeleteProduct}
          /> : 
          <ProductForm 
                  onClose={onClose} 
                  productId={productId}
          />
          }
      </Modal>
      <ToastContainer/>
    </Box>
  )
}

export default Products