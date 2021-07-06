import api from '../Config/api'
import Order from '../Contracts/Models/Order'
import Paginated from '../Contracts/Models/Paginated'

const DEFAULT_PATH = '/order'
export default class OrderService {
  static async getAll(page: number, limit: number, query: object) {
    return api.get<Paginated<Order>>(DEFAULT_PATH, {
      params: {
        page,
        limit,
        ...query,
      },
    })
  }

  static async getOne(orderId: number) {
    return api.get<Order>(`${DEFAULT_PATH}/${orderId}`)
  }
}
