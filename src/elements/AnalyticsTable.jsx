import React, { useEffect, useState } from 'react'
import { WarningCircle } from 'phosphor-react' 
import { formattedDate } from '../function/formattedDate'
import axios  from 'axios'
import { Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Modal, ModalOverlay} from '@chakra-ui/react'
import OrderlistsDetail from '../components/OrderlistsDetail'
import { useDisclosure } from '@chakra-ui/react'

const AnalyticsTable = () => {

    const [tableData, setTableData] = useState([])
    const [orderId, setOrderId] = useState()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const getFinishedOrder = async () => {
         try {
            const response = await axios.get(`https://seblak-api-40223dc59db0.herokuapp.com/order/finishedorder/${"finished"}`)
                setTableData(response.data?.data)
         } catch (error) {
            console.log(error)
         }
    }

    useEffect(() => {
        getFinishedOrder()
    }, [])

    const getDetail = (id) => {
        setOrderId(id)
        onOpen()
    }

    const mapTableData = () => {
        return tableData.map((data, index) => (
            <Tr key={index}>
                <Td>{data.client}</Td>
                <Td>{formattedDate(data.createdAt)}</Td>
                <Td>25.4</Td>
                <Td
                    display='flex'
                    alignItems='center'
                    gap='5px'
                    cursor='pointer'
                    onClick={() => getDetail(data.id)}
                >Detail <WarningCircle size={20}/>
                </Td>
            </Tr>
        ))
    }

  return (
    <Box>
        <TableContainer border='1px solid black'>
            <Table size='sm'>
                <Thead>
                <Tr>
                    <Th>Name</Th>
                    <Th>Date</Th>
                    <Th>Total</Th>
                    <Th>Detail</Th>
                </Tr>
                </Thead>
                <Tbody>
                    {mapTableData()}
                </Tbody>
            </Table>
        </TableContainer>
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