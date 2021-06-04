import React from 'react'
import Modal from '../../Components/Modal'

export interface ModalAddPieceProps {
    open?: boolean
}

const ModalAddPiece : React.FC<ModalAddPieceProps> = ({open}) => {

  return <Modal modalProps = {{open: open as boolean }}>
      Hello world
  </Modal>
}

ModalAddPiece.defaultProps = {
  open: false
}

export default ModalAddPiece