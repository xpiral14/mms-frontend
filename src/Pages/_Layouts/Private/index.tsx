import React, { useEffect } from 'react'
import AppVersion from '../../../Containers/AppVersion'
import NavBar from '../../../Containers/NavBar'
import Notification from '../../../Contracts/Models/Notification'
import { useAuth } from '../../../Hooks/useAuth'
import useSocket from '../../../Hooks/useSocket'
import { useToast } from '../../../Hooks/useToast'
import NotificationService from '../../../Services/NotificationService'
import menu from '../../../Statics/menu'

const PrivateLayout: React.FC = ({ children }) => {
  const { showPrimaryToast, showErrorToast, showWarningToast } = useToast()
  const { auth } = useAuth()
  const socket = useSocket()
  useEffect(() => {
    if (!auth) {
      return
    }
    const channel = socket?.private('User.' + auth.user.id)

    channel
      .notification((notification: Notification) => {
        showPrimaryToast({
          message: notification.message,
          action: {
            icon: 'tick',

            onClick: () => {
              NotificationService.markAsRead(notification.id)
            },
            text: '',
          },
        })
      })
      .error((error: any) => {
        if (error.type === 'AuthError') {
          showErrorToast(
            'Houve um problema ao tentar conectá-lo ao servidor em tempo real para receber notificções. Recarregue a página para tentar novamente se o problema persistir entre em contato com o suporte'
          )
        }
      })

    socket.private(`Company.${auth.user.company_id}.PartStock`)
      .error((error: any) => {
        if (error.type === 'AuthError') {
          showErrorToast(
            'Houve um problema ao tentar conectá-lo ao servidor em tempo real para receber alertas do estoque. Recarregue a página para tentar novamente se o problema persistir entre em contato com o suporte'
          )
        }
      })
      .listen('PartStockWarning', (ev: any) => {
        showWarningToast(ev.message)
      })

    return () => {
      socket.leave('User.' + auth?.user.id)
      socket.leave(`Company.${auth.user.company_id}.PartStock`)
    }
  }, [auth])

  return (
    <div style={{ position: 'relative' }}>
      <NavBar menuItems={menu as any} />
      {children}

      <AppVersion />
    </div>
  )
}

export default PrivateLayout
