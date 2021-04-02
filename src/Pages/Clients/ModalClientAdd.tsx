import React, { SetStateAction } from 'react'
import { Button, Grid } from '@material-ui/core'
import { Add as AddIcon } from '@material-ui/icons'

interface ModalClientAddProps {
  title?: string,
  modalState: React.ComponentState,
  setModalState: React.Dispatch<SetStateAction<boolean>>
}

const ModalClientAdd: React.FC<ModalClientAddProps> = (
  //eslint-disable-next-line
  { title, modalState, setModalState }
) => {
  return (
    <>
      <Grid container xs={12} alignItems='center'>
        <h1>
          {title || 'DefaultTitle'}
        </h1>
        <Button onClick={() => { setModalState(false) }}>
          <AddIcon />
            Close Modal
        </Button>
      </Grid>
    </>
  )
}

export default ModalClientAdd
