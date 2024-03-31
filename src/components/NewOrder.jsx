import React from 'react'
import { FormControl, Input } from '@chakra-ui/react'
import ModalElement from './ModalElement'

const NewOrder = ({ clientName, setClientName, onClose, actionFunction }) => {

    
  return (
        <ModalElement onClose={onClose} 
                      action={"Create Order"} 
                      actionFunction={actionFunction} 
                      modalHeader='New Order'
        >
          <FormControl action="submit" 
                       gap='5px' 
                       display='flex' 
                       alignItems='center'>
                <Input placeholder='Nama Pemesan' 
                       value={clientName} 
                       type="text" 
                       onChange={(e) => setClientName(e.target.value)}
                />
          </FormControl>
        </ModalElement>

  )
}

export default NewOrder