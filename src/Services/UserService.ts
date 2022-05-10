import api from '../Config/api'
import Response from '../Contracts/Models/Response'
import User from '../Contracts/Models/User'
import makeURL from '../Util/makeURL'

export default class UserService {
  static defaultPath = '/users'
  static async getAll() {
    const response = api.get<User[]>(this.defaultPath)

    return (await response).data
  }

  static async getOne(userId: number) {
    const response = api.get<User>(`${this.defaultPath}/${userId}`)
    return (await response).data
  }

  static async update(userId: number, userData: User){
    return api.put<Response<User>>(makeURL(this.defaultPath, userId), userData)
  }
}
