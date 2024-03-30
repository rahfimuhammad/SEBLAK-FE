import React from 'react'
import { ModalContent, ModalCloseButton, ModalHeader, ModalFooter, ModalBody, Button } from '@chakra-ui/react'
import { IsSmallScreen } from '../hooks/useSmallScreen'

const ModalElement = ({ children, modalHeader, action, onClose, actionFunction }) => {

    const isSmall = IsSmallScreen()

  return (
        <ModalContent w={isSmall? "95%" : "400px"} maxW='98%'>
            <ModalHeader>{modalHeader}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {children}  
            </ModalBody>
            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                    Close
                </Button>
                {action && <Button variant='ghost' onClick={actionFunction}>
                    {action}
                </Button>}
            </ModalFooter>
        </ModalContent>
  )
}

export default ModalElement