import React from 'react'
import { useOrder } from '../context/OrderProvider'
import { FormControl, Input } from '@chakra-ui/react'
import ModalElement from './ModalElement'

const NewOrder = ({ data, setClientName, onClose }) => {

  const { createOrder } = useOrder()
  const handleCreateOrder = async () => {
    await createOrder(data)
    onClose()
  }
    
  return (
        <ModalElement 
                  onClose={onClose} 
                  action={"Create Order"} 
                  actionFunction={() => handleCreateOrder()} 
                  modalHeader='New Order'
        >
          <FormControl 
                    action="submit" 
                    gap='5px' 
                    display='flex' 
                    alignItems='center'>
                <Input 
                    placeholder='Nama Pemesan' 
                    value={data} 
                    type="text" 
                    onChange={(e) => setClientName(e.target.value)}
                />
          </FormControl>
        </ModalElement>

  )
}

export default NewOrder