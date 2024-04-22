import React from 'react'
import AnalyticsTable from '../elements/AnalyticsTable'
import { Box } from '@chakra-ui/react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Analytics = () => {
  return (
    <Box w='100%'>
        <AnalyticsTable/>
        <ToastContainer/>
    </Box>
  )
}

export default Analytics