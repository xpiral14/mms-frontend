import React from 'react'
import { Menu, MenuItem } from '@blueprintjs/core'
import Notification from '../../Contracts/Models/Notification'
import Button from '../Button'
import { Body } from './styles'

const NotificationItem = ({
  notification,
  onClick,
}: {
  notification: Notification
  onClick?: () => void
}) => {
  return (
    <Body  readed={notification.readed} onClick={onClick} className='d-flex p-2'>
      <span>{notification.message}</span>
      <Button
        icon='more'
        help={
          <Menu>
            <MenuItem icon='tick' text='Marcar como lida' />
            <MenuItem icon='trash' text='Remover notificação' />
          </Menu>
        }
        helpType='popover'
        small
        minimal
      />
    </Body>
  )
}

export default NotificationItem
