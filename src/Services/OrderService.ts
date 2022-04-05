import api from '../Config/api'
import Order, {OrderPayload} from '../Contracts/Models/Order'
import Paginated from '../Contracts/Models/Paginated'
import Response from '../Contracts/Models/Response'
import OrderServiceModel from '../Contracts/Models/OrderService'

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
    return api.post<Response<Order>>(DEFAULT_PATH, order)
  }

  static async delete(orderId: number) {
    return api.delete(`${DEFAULT_PATH}/${orderId}`)
  }

  static async getOne(orderId: number) {
    return api.get<Response<Order>>(`${DEFAULT_PATH}/${orderId}`)
  }

  static async addService(orderId: number, orderService: OrderServiceModel) {
    return api.post(`${DEFAULT_PATH}/${orderId}/orderServices`, orderService)
  }

  static async addServices(orderId: number, serviceIds: number[]) {
    return api.post(`${DEFAULT_PATH}/${orderId}/services`, {
      serviceIds
    })
  }

  static async configServiceOrder(orderId: number, serviceId: number, payload: {
    estimatedTime: number,
    partIds: number[],
    description?: string
  }) {
    return api.post(`${DEFAULT_PATH}/${orderId}/serivces/${serviceId}`, payload)
  }

  static async getOrderServices(orderId: number) {
    return api.get<Paginated<OrderServiceModel>>(`${DEFAULT_PATH}/${orderId}/orderParts`)
  }

  static async deleteOrderService(orderId: number, orderServiceId: number) {
    return api.delete(`${DEFAULT_PATH}/${orderId}/orderServices/${orderServiceId}`)
  }
}
