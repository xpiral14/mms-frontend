import { Colors, Intent } from '@blueprintjs/core'
import Button from '../../Components/Button'
import Container from '../../Components/Layout/Container'
import Row from '../../Components/Layout/Row'
import NotificationItem from '../../Components/NotificationItem'
import NotificationModel from '../../Contracts/Models/Notification'

const notifcations = [
  {
    id: 1,
    message:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, porro.',
    type: 'order-created',
    readed: true,
    payload: {
      date: '2022-05-11T07:00:00',

      order: 1,
    } as any,
  },
  {
    id: 2,
    message:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, porro.',
    type: 'order-created',
    readed: false,
    payload: {
      date: '2022-05-11T07:00:00',

      order: 1,
    } as any,
  },
  {
    id: 3,
    message:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, porro.',
    type: 'order-created',
    readed: true,
    payload: {
      date: '2022-05-11T07:00:00',
      order: 1,
    } as any,
  },
  {
    id: 4,
    message:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, porro.',
    type: 'order-created',
    readed: true,
    payload: {
      date: '2022-05-11T07:00:00',

      order: 1,
    } as any,
  },
  {
    id: 5,
    message:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, porro.',
    type: 'order-created',
    readed: true,
    date: '2022-05-11T07:00:00',
    payload: {
      order: 1,
    } as any,
  },
  {
    id: 6,
    message:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, porro.',
    type: 'order-created',
    readed: true,
    date: '2022-05-11T07:00:00',
    payload: {
      order: 1,
    } as any,
  },
  {
    id: 7,
    message:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, porro.',
    type: 'order-created',
    readed: true,
    date: '2022-05-11T07:00:00',
    payload: {
      order: 1,
    } as any,
  },
] as NotificationModel[]
const Notification = () => {

  return (
    <Container
      style={{
        width: 250,
        maxHeight: 420,
        overflowY: 'scroll',
        position: 'relative',
      }}
      className='pt-1 pb-1 ps-1'
    >
      <Row
        className='pt-1'
        style={{
          position: 'fixed',
          background: Colors.WHITE,
          width: 236,
          top: 0,
        }}
      >
        <Button
          minimal
          outlined
          small
          help='Marcar todas como lidas'
          icon='tick'
          intent={Intent.SUCCESS}
        />
      </Row>
      <div style={{ marginTop: 24 }}>
        {notifcations.map((n) => (
          <NotificationItem notification={n} key={n.id} />
        ))}
      </div>
    </Container>
  )
}

export default Notification
