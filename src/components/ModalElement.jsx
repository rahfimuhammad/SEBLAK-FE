import React from 'react'
import { ModalContent, ModalCloseButton, ModalHeader, ModalFooter, ModalBody, Button } from '@chakra-ui/react'
import { IsSmallScreen } from '../function/detectSmallScreen'
import Spinner from './Spinner'
import { useOrder } from '../context/OrderProvider'

const ModalElement = ({ children, modalHeader, action, onClose, actionFunction }) => {

    const isSmall = IsSmallScreen()
    const { isLoading } = useOrder()

  return (
        <ModalContent 
                w={isSmall? "95%" : "400px"} 
        >
            <ModalHeader>
                {modalHeader}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {children}  
            </ModalBody>
            <ModalFooter>
                <Button 
                    colorScheme='red' 
                    mr='5px' 
                    onClick={onClose}
                >
                    Close
                </Button>
                {action && <Button
                                colorScheme='green' 
                                onClick={actionFunction}
                >
                    {action}
                </Button>}
            </ModalFooter>
        </ModalContent>
  )
}

export default ModalElement