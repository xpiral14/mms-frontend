import api from '../Config/api'
import Notification from '../Contracts/Models/Notification'
import Paginated from '../Contracts/Models/Paginated'
import makeUrl from '../Util/makeURL'
export default class NotificationService {
  public static delete(notificationId: string) {
    return api.delete(makeUrl('users', 'notifications', notificationId))
  }

  public static markAsRead(notificationId: string) {
    return api.put(makeUrl('users','notifications', notificationId, 'read'))
  }

  public static getAll(page = 0, limit = 20) {
    return api.get<Paginated<Notification>>(makeUrl('users','notifications','paginated'), {
      params: { limit, page: page  },
    })
  }

  public static markAllAsRead(){
    return api.put(makeUrl('users', 'notifications', 'mark-all-as-read'))
  }
}
