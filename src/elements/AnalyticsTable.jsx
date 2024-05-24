import React, { useEffect, useState } from 'react'
import { useOrder } from '../context/OrderProvider'
import { formattedDateTable } from '../function/formattedDate'
import { formatCurrency } from '../function/formattedCurrency'
import { useDisclosure, Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Modal, ModalOverlay, Button, Select, Input} from '@chakra-ui/react'
import { IsSmallScreen } from '../function/detectSmallScreen'
import axios  from 'axios'
import OrderlistsDetail from '../components/OrderlistsDetail'
import DeleteForm from './DeleteForm'
import Spinner from './Spinner'
import { LeftOutlined, RightOutlined, InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons'

const AnalyticsTable = () => {

    const { deleteOrder } = useOrder()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [tableData, setTableData] = useState([])
    const [orderId, setOrderId] = useState()
    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState()
    const formattedDate = date? new Date(date).toISOString() : ""
    const [sortBy, setSortBy] = useState("datedesc")
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(0)
    const [isDetail, setIsDetail] = useState(false)
    const [isDelete, setIsDelete] = useState(false)

    const getFinishedOrder = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                `https://seblak-api-40223dc59db0.herokuapp.com/order/finished?page=${page}&date=${formattedDate}&sortBy=${sortBy}`
            )
                setTableData(response.data?.data)
                setPageSize(response.data?.totalPages)
        } catch (error) {
                console.log(error)
        } finally {
                setLoading(false)
        }
    }

    useEffect(() => {

            getFinishedOrder()
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy, date, page])

    const onDetail = (id) => {
        setOrderId(id)
        setIsDelete(false)
        setIsDetail(true)
        onOpen()
    }

    const onDelete = (id) => {
        setOrderId(id)
        setIsDetail(false)
        setIsDelete(true)
        onOpen()
    }

    const handleDeleteOrder = async () => {
        await deleteOrder(orderId)
        getFinishedOrder()
        onClose()
        setIsDelete(false)
    }

    const mapTableData = () => {
        return tableData.map((data, index) => (
            <Tr key={index}>
                <Td position='sticky' left='0' bg='white' whiteSpace= 'nowrap' overflow='auto'>{data.client}</Td>
                <Td whiteSpace= 'nowrap' overflow='auto'>{formattedDateTable(data.createdAt)}</Td>
                <Td whiteSpace= 'nowrap' overflow='auto'>{formatCurrency(data.total)}</Td>
                <Td
                    display='flex'
                    alignItems='center'
                    gap='5px'
                    cursor='pointer'
                >
                    <Button size='sm' colorScheme='teal' onClick={() => onDetail(data.id)}>
                        <InfoCircleOutlined style={{fontSize: '20px'}}/>
                    </Button>
                    <Button size='sm' colorScheme='red' onClick={() => onDelete(data.id)}>
                        <DeleteOutlined style={{fontSize: '20px'}}/>
                    </Button>
                </Td>
            </Tr>
        ))
    }

    return (
        <Box w='100%' p='10px' display='flex' flexDirection='column' gap='10px'>
            <Box w='100%' overflowX='auto'>
                <Box w='fit-content' display='flex' gap='10px'>
                    <Select w='fit-content' onChange={(e) => setSortBy(e.target.value)}>
                        <option defaultChecked={true} value='datedesc'>Default</option>
                        <option defaultChecked={false} value='nameasc'>Name A - Z</option>
                        <option defaultChecked={false} value='namedesc'>Name Z - A</option>
                        <option defaultChecked={false} value='priceasc'>Price A - Z</option>
                        <option defaultChecked={false} value='pricedesc'>Price Z - A</option>
                    </Select>
                    <Input 
                        onChange={(e) => setDate(e.target.value)}  
                        w='fit-content' 
                        placeholder='default placeholder' 
                        size='md' 
                        type='datetime-local' 
                    />
                </Box>
            </Box>
            {loading?
            <Box w='100%' h='150px' display='flex' justifyContent='center' alignItems='center'>
                <Spinner size={25} />
            </Box>
            :
            <TableContainer borderWidth="1px" w="100%" overflowX="auto" whiteSpace='collapse' borderRadius='5px' position='relative' onClick={() => console.log(formattedDate)}>
                <Table size={IsSmallScreen? "sm" : "md"} w='100%'>
                    <Thead>
                    <Tr>
                        <Th position='sticky' left='0' bg='white' paddingY={3}>Name</Th>
                        <Th>Date</Th>
                        <Th>Transaction</Th>
                        <Th>Action</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                        {mapTableData()}
                    </Tbody>
                </Table>
            </TableContainer>
            }
            {(!loading && tableData.length > 0) && <Box
                                                    display='flex'
                                                    gap='5px'
                                                    justifyContent='center'
                                                    alignItems='center'
            >
                <Button isDisabled={page === 1} colorScheme='gray' onClick={() => setPage(prevState => prevState -= 1)}><LeftOutlined style={{fontSize: '25px'}}/></Button>
                <Button isDisabled={page === pageSize} colorScheme='gray' onClick={() => setPage(prevState => prevState += 1)}><RightOutlined style={{fontSize: '25px'}}/></Button>
            </Box>
            }
            <Modal 
                isOpen={isOpen} 
                onClose={onClose}
            >
            <ModalOverlay />
            {isDetail && <OrderlistsDetail
                            orderId={orderId} 
                            onClose={onClose} 
            />}
            {isDelete && <DeleteForm
                    onClose={onClose}
                    orderId={orderId}
                    actionFunction={handleDeleteOrder} 
            />}
            </Modal>
        </Box>
    )
}

export default AnalyticsTable