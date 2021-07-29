import api from '../Config/api'
import User from '../Contracts/Models/User'

export default class CompanyService {
  static defaultPath = '/user'
  static async getAll() {
    const response = api.get<User[]>(this.defaultPath)

    return (await response).data
  }

  static async getOne(userId: number) {
    const response = api.get<User>(`${this.defaultPath}/${userId}`)
    return (await response).data
  }
}
