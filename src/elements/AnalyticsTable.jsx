import React, { useEffect, useState } from 'react'
import { Info } from 'phosphor-react' 
import { formattedDateTable } from '../function/formattedDate'
import { formatCurrency } from '../function/formattedCurrency'
import axios  from 'axios'
import { useDisclosure, Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Modal, ModalOverlay, Button, Select} from '@chakra-ui/react'
import OrderlistsDetail from '../components/OrderlistsDetail'
import Spinner from './Spinner'
import { IsSmallScreen } from '../function/detectSmallScreen'

const AnalyticsTable = () => {

    const [tableData, setTableData] = useState([])
    const [orderId, setOrderId] = useState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState("all")
    const [sortBy, setSortBy] = useState("datedesc")
    const [page, setPage] = useState(1)

    const getFinishedOrder = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`https://seblak-api-40223dc59db0.herokuapp.com/order/finished?page=${page}&dateRange=${date}&sortBy=${sortBy}`)
                setTableData(response.data?.data)
        } catch (error) {
                console.log(error)
        } finally {
                setLoading(false)
        }
    }

    useEffect(() => {
        getFinishedOrder()
    }, [sortBy, date])

    const getDetail = (id) => {
        setOrderId(id)
        onOpen()
    }

    const mapTableData = () => {
        return tableData.map((data, index) => (
            <Tr key={index}>
                <Td position='sticky' left='0' bg='white' whiteSpace= 'nowrap' overflow='auto'>{data.client}</Td>
                <Td whiteSpace= 'nowrap' overflow='auto'>{formattedDateTable(data.createdAt)}</Td>
                <Td whiteSpace= 'nowrap' overflow='auto'>{formatCurrency(25000)}</Td>
                <Td
                    display='flex'
                    alignItems='center'
                    gap='5px'
                    cursor='pointer'
                    onClick={() => getDetail(data.id)}
                >
                    <Button size='sm' colorScheme='teal'>
                        <Info size={20}/>
                    </Button>
                </Td>
            </Tr>
        ))
    }

    return (
        <Box w='100%' p='10px' display='flex' flexDirection='column' gap='10px'>
            <Box maxW='100%' display='flex' gap='10px'>
                <Select w='fit-content' onChange={(e) => setSortBy(e.target.value)}>
                    <option defaultChecked={false} value='dateasc'>Date A - Z</option>
                    <option defaultChecked={true} value='datedesc'>Date Z - A</option>
                    <option defaultChecked={false} value='nameasc'>Name A - Z</option>
                    <option defaultChecked={false} value='namedesc'>Name Z - A</option>
                    <option defaultChecked={false} value='priceasc'>Price A - Z</option>
                    <option defaultChecked={false} value='pricedesc'>Price Z - A</option>
                </Select>
                <Select w='fit-content' onChange={(e) => setDate(e.target.value)}>
                    <option defaultChecked={true} value='all'>All</option>
                    <option defaultChecked={false} value='today'>Today</option>
                    <option defaultChecked={false} value='lastWeek'>Last week</option>
                    <option defaultChecked={false} value='lastMonth'>Last Month</option>
                    <option defaultChecked={false} value='lastThreeMonths'>Last 3 Months</option>
                </Select>
            </Box>
            {loading?
            <Box w='100%' h='150px' display='flex' justifyContent='center' alignItems='center'>
                <Spinner size={25} />
            </Box>
            :
            <TableContainer borderWidth="1px" w="100%" overflowX="auto" whiteSpace='collapse' borderRadius='5px' position='relative'>
                <Table size={IsSmallScreen? "sm" : "md"} w='100%'>
                    <Thead>
                    <Tr>
                        <Th position='sticky' left='0' bg='white' paddingY={3}>Name</Th>
                        <Th>Date</Th>
                        <Th>Transaction</Th>
                        <Th>Detail</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                        {mapTableData()}
                    </Tbody>
                </Table>
            </TableContainer>
            }
            <Modal 
                isOpen={isOpen} 
                onClose={onClose}
            >
            <ModalOverlay />
            <OrderlistsDetail 
                            orderId={orderId} 
                            onClose={onClose} 
            />
            </Modal>
        </Box>
    )
}

export default AnalyticsTable