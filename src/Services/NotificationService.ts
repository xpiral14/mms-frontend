import api from '../Config/api'
import Notification from '../Contracts/Models/Notification'
import makeUrl from '../Util/makeURL'
export default class NotificationService {
  public static delete(userId: number, notificationId: number) {
    return api.delete(makeUrl('users', userId, 'notifications', notificationId))
  }
  public static markAsRead(userId: number, notification: Notification) {
    return api.put(makeUrl('users', userId, 'notifications', notification.id), {
      ...notification,
      readed: true,
    })
  }
}
