import { Colors, Intent } from '@blueprintjs/core'
import { useEffect, useMemo, useState } from 'react'
import Button from '../../Components/Button'
import Container from '../../Components/Layout/Container'
import Row from '../../Components/Layout/Row'
import NotificationItem from '../../Components/NotificationItem'
import NotificationModel from '../../Contracts/Models/Notification'
import useAsync from '../../Hooks/useAsync'
import { useAuth } from '../../Hooks/useAuth'
import useMessageError from '../../Hooks/useMessageError'
import useSocket from '../../Hooks/useSocket'
import NotificationService from '../../Services/NotificationService'
import { RiEyeCloseLine } from 'react-icons/ri'
import { Meta } from '../../Contracts/Models/Paginated'
import Render from '../../Components/Render'

enum NotificationFilterType {
  UNREAD = 'UNREAD',
  ALL = 'ALL',
}
const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationModel[]>([])
  const [filterBy, setFilterBy] = useState(NotificationFilterType.ALL)
  const [pagination, setPagination] = useState<Meta>({
    currentPage: 1,
    firstPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 1,
  })
  const { auth } = useAuth()
  const { showErrorMessage: showErrormessage } = useMessageError()
  const [loadingNotifications, loadNotifications] = useAsync(async () => {
    try {
      const response = await NotificationService.getAll(1, pagination.perPage)
      setPagination(response.data.meta)

      setNotifications(response.data.data)
    } catch (error) {
      showErrormessage(
        error,
        'Não foi possível listar suas notificaçõs. Por favor, tente novamente'
      )
    }
  }, [filterBy, pagination.perPage])
  const socket = useSocket()

  const filteredNotifications = useMemo(() => {
    switch (filterBy) {
    case NotificationFilterType.ALL: {
      return notifications
    }
    case NotificationFilterType.UNREAD: {
      return notifications.filter((n) => !n.read_at)
    }
    }
  }, [notifications])

  useEffect(() => {
    const channel = socket?.private('User.' + auth?.user.id)
    channel.notification((notification: NotificationModel) => {
      setNotifications((prev) => [notification, ...prev])
    })

    return () => {
      socket.leave('User.' + auth?.user.id)
    }
  }, [])

  return (
    <Container
      style={{
        width: 350,
        maxHeight: 420,
        overflowY: 'scroll',
        position: 'relative',
      }}
      className='pt-1 pb-1 ps-1'
    >
      <Row
        className='py-1'
        style={{
          position: 'fixed',
          background: Colors.WHITE,
          width: 236,
          top: 0,
          zIndex: 99,
        }}
      >
        <Button
          minimal
          outlined
          small
          help='Marcar todas como lidas'
          onClick={async () => {
            try {
              await NotificationService.markAllAsRead()
              setNotifications((prev) =>
                prev.map((n) => ({
                  ...n,
                  read_at: new Date().toJSON(),
                }))
              )
            } catch (error) {
              showErrormessage(
                error,
                'Não foi possível marcar todas as notificações como lidas. Por favor, tente novamente'
              )
            }
          }}
          icon='tick'
          loading={loadingNotifications}
          intent={Intent.SUCCESS}
        />
        <Button
          minimal
          outlined
          small
          help='Recarregar'
          icon='refresh'
          loading={loadingNotifications}
          onClick={loadNotifications}
          intent={Intent.SUCCESS}
        />
        <Button
          outlined={filterBy === NotificationFilterType.ALL}
          small
          help='Não lidas'
          icon={<RiEyeCloseLine size={14} />}
          loading={loadingNotifications}
          onClick={() => {
            setFilterBy((prev) =>
              prev === NotificationFilterType.ALL
                ? NotificationFilterType.UNREAD
                : NotificationFilterType.ALL
            )
          }}
          intent={Intent.SUCCESS}
        />
      </Row>
      <Row>
        <div style={{ marginTop: 32 }}>
          {filteredNotifications.map((n) => (
            <NotificationItem notification={n} key={n.id} />
          ))}
        </div>
      </Row>
      <Render
        renderIf={Boolean(
          pagination.total && pagination.total > notifications.length
        )}
      >
        <Row className='flex-center py-2'>
          <Button
            small
            outlined
            loading={loadingNotifications}
            onClick={() =>
              setPagination((prev) => {
                const copy = { ...prev }
                copy.perPage = prev.perPage + 10
                return copy
              })
            }
          >
            Carregar mais
          </Button>
        </Row>
      </Render>

      <Render renderIf={!pagination.total && !loadingNotifications}>
        Você não possui notificações no momento
      </Render>
    </Container>
  )
}

export default Notification
