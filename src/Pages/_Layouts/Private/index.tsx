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
  const { showPrimaryToast } = useToast()
  const { auth } = useAuth()
  const socket = useSocket()
  useEffect(() => {
    const channel = socket?.private('User.' + auth?.user.id)

    channel.notification((notification: Notification) => {
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
    return () => {
      socket.leave('User.' + auth?.user.id)
    }
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <NavBar menuItems={menu as any} />
      {children}

      <AppVersion />
    </div>
  )
}

export default PrivateLayout
