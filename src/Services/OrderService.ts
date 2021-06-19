import api from '../Config/api'
import Order from '../Contracts/Models/Order'
import Paginated from '../Contracts/Models/Paginated'

export default class OrderService {
  static DEFAULT_PATH = '/company/order'

  static async getAll(page: number, limit: number, query: object) {
    return api.get<Paginated<Order>>('/company/order', {
      params: {
        page,
        limit,
        ...query,
      },
    })
  }

  static async getOne(orderId: number) {
    return api.get<Order>(`${this.DEFAULT_PATH}/${orderId}`)
  }
}
