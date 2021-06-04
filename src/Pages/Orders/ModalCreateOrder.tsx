import React from 'react'
import Modal from '../../Components/Modal'

export interface ModalCreateorderProps {
    open?: boolean;
    onClose?: () => void;
}

const ModalCreateOrder : React.FC<ModalCreateorderProps> = ({open, onClose}) => {

  return <Modal modalProps = {{open: open as boolean, onClose:onClose}}>
     Criar ordem de serviço
  </Modal>
}

ModalCreateOrder.defaultProps = {
  open: false
}

export default ModalCreateOrder