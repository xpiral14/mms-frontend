import { Button } from '@blueprintjs/core'
import React from 'react'
import { SubScreenProps } from '../../../Contracts/Components/ScreenProps'
import { useScreen } from '../../../Hooks/useScreen'
import { useToast } from '../../../Hooks/useToast'

interface UserProps extends SubScreenProps {
  text?: string
}

const Users: React.FC<UserProps> = ({ parentScreen, screen, text }) => {
  const { openSubScreen: openSubPanel } = useScreen()
  const { showToast } = useToast()
  const frontParent = () => parentScreen?.front()

  return (
    <div>
      {text || 'Tela de usuários'}
      <Button
        text='Abrir alerta'
        onClick={() =>
          parentScreen
            ? frontParent()
            : openSubPanel(
              {
                id: 'user-register',
                headerTitle: 'Ola mundo',
                callback: () => {
                  showToast({
                    message: 'Ola mundo abriu',
                  })
                },
              },
              screen.id,
              {
                text: 'teste teste',
              }
            )
        }
      />
    </div>
  )
}

export default Users
