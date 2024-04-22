import React from 'react'
import ModalElement from './ModalElement'

const DeleteForm = ({onClose, actionFunction}) => {

    return (
        <>
            <ModalElement 
                    modalHeader="Delete Form" 
                    action="Continue" 
                    actionFunction={actionFunction}
                    onClose={onClose}
            >
                <p>Are you sure you want to continue this process?</p>
            </ModalElement>
        </>
    )
}

export default DeleteForm