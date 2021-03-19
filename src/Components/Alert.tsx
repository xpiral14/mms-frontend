import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

export interface AlertDialogProps {
  open?: boolean
  handleClose?: (() => void) | (() => Promise<void>)
  handleConfirm?: (() => void) | (() => Promise<void>);  
  title?: React.ReactNode
  text?: React.ReactNode
  buttonConfirmText?: React.ReactNode
  buttonCancelText?: React.ReactNode
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  handleClose,
  title,
  text,
  buttonConfirmText,
  buttonCancelText,
  handleConfirm
}) => {

  return (
    <Dialog
      open={Boolean(open)}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>
        {title || 'Aviso!'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {text || 'Você tem certeza que deseja executar essa ação?'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          {buttonCancelText || 'Cancelar'}
        </Button>
        <Button onClick={handleConfirm} color='primary' autoFocus>
          {buttonConfirmText || 'Confirmar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AlertDialog