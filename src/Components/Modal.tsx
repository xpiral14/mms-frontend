import {
  Backdrop,
  Fade,
  FadeProps,
  makeStyles,
  Modal as MaterialModal,
  ModalProps,
} from '@material-ui/core'
import React from 'react'

type ModalCenterProps = {
  modalProps?: ModalProps
  fadeProps?: FadeProps
}

const Modal : React.FC<ModalCenterProps> = (props) => {
  const useStyle = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
    },
  }))

  const classes = useStyle()
  return (
    <MaterialModal
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      className={classes.modal}
      {...props.modalProps as any}
    >
      <Fade in={props.modalProps?.open} {...props.fadeProps}>
        <div className={classes.paper}>
          {props.children as any}
        </div>
      </Fade>
    </MaterialModal>
  )
}

export default Modal
