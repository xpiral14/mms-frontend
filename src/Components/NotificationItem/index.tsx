import React, { useState } from 'react'
import { Menu, MenuItem } from '@blueprintjs/core'
import Notification from '../../Contracts/Models/Notification'
import Button from '../Button'
import { Body, Time } from './styles'
import NotificationService from '../../Services/NotificationService'
import { formatDistance } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
const NotificationItem = ({
  notification,
  onClick,
}: {
  notification: Notification
  onClick?: () => void
}) => {
  const getDistance = () =>
    formatDistance(new Date(notification.created_at), new Date(), {
      locale: ptBR,
      addSuffix: true,
    })
  const [distance, setDistance] = useState(getDistance())
  useState(() => {
    const intervalId = setInterval(() => setDistance(getDistance()), 5000)

    return () => {
      clearInterval(intervalId)
    }
  })
  return (
    <Body
      readed={Boolean(notification.read_at)}
      onClick={onClick}
      className='d-flex px-2 pb-3'
    >
      <span>{notification.message}</span>
      <Button
        icon='more'
        help={
          <Menu>
            <MenuItem
              icon='tick'
              text='Marcar como lida'
              onClick={() => NotificationService.markAsRead(notification.id)}
            />
            <MenuItem
              icon='trash'
              text='Remover notificação'
              onClick={() => NotificationService.delete(notification.id)}
            />
          </Menu>
        }
        helpType='popover'
        small
        minimal
      />
      <Time>{distance}</Time>
    </Body>
  )
}

export default NotificationItem
