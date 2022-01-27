import api from '../Config/api'
import Order, { OrderPayload } from '../Contracts/Models/Order'
import Paginated from '../Contracts/Models/Paginated'

const DEFAULT_PATH = '/orders'
export default class OrderService {
  static async getAll(page: number, limit: number, query: object) {
    return api.get<Paginated<Order>>(`${DEFAULT_PATH}/paginated`, {
      params: {
        page,
        limit,
        ...query,
      },
    })
  }

  static async create(order: Partial<OrderPayload>) {
    return api.post(DEFAULT_PATH, order)
  }

  static async delete(orderId: number) {
    return api.delete(`${DEFAULT_PATH}/${orderId}`)
  }

  static async getOne(orderId: number) {
    return api.get<Order>(`${DEFAULT_PATH}/${orderId}`)
  }
}
