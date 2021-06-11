import { Button, Intent } from '@blueprintjs/core'
import React from 'react'
import { useAlert } from '../../../Hooks/useAlert'

const Users = () => {
  const { openAlert } = useAlert()
  return (
    <div>
      Tela de usuários
      <Button
        text='Abrir alerta'
        onClick={() =>
          openAlert({
            canEscapeKeyCancel: true,
            canOutsideClickCancel: true,
            intent: Intent.DANGER,
            text: 'alerta abrido',
            confirmButtonText: 'Tem certeza po?',
            cancelButtonText: 'Vai cancelar mesmo?',
          })
        }
      />
    </div>
  )
}

export default Users
