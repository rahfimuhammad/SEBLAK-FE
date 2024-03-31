import React from 'react'
import { ModalContent, ModalCloseButton, ModalHeader, ModalFooter, ModalBody, Button } from '@chakra-ui/react'
import { IsSmallScreen } from '../function/detectSmallScreen'
import Spinner from './Spinner'
import { useOrder } from '../context/OrderProvider'

const ModalElement = ({ children, modalHeader, action, onClose, actionFunction }) => {

    const isSmall = IsSmallScreen()
    const { isLoading } = useOrder

  return (
        <ModalContent w={isSmall? "95%" : "400px"} 
                      maxW='98%'>
            <ModalHeader>
                {modalHeader}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {children}  
            </ModalBody>
            <ModalFooter>
                <Button colorScheme='blue' mr={3} 
                        onClick={onClose}
                >
                    Close
                </Button>
                {action && <button 
                                onClick={actionFunction}
                >
                    {isLoading? <Spinner size={20}/> : action}
                </button>}
            </ModalFooter>
        </ModalContent>
  )
}

export default ModalElement