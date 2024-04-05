import React, { useEffect, useState } from 'react'
import { WarningCircle } from 'phosphor-react' 
import { formattedDate } from '../function/formattedDate'
import axios  from 'axios'
import { Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react'

const AnalyticsTable = () => {

    const [tableData, setTableData] = useState([])

    const getFinishedOrder = async () => {
         try {
            const response = await axios.get(`http://192.168.100.10:5000/order/finishedorder/${"finished"}`)
                setTableData(response.data?.data)
         } catch (error) {
            console.log(error)
         }
    }

    useEffect(() => {
        getFinishedOrder()
    }, [])

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
    </Box>
  )
}

export default AnalyticsTable