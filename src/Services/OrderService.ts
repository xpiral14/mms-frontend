import api from '../Config/api'
import Order from '../Contracts/Models/Order'
import Paginated from '../Contracts/Models/Paginated'
import Response from '../Contracts/Models/Response'
import OrderServiceModel from '../Contracts/Models/OrderService'
import OrderPart from '../Contracts/Models/OrderPart'
import Part from '../Contracts/Models/Part'

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

  static async create(order: any) {
    return api.post<Response<Order>>(DEFAULT_PATH, order)
  }

  static async edit(order: Order){
    return api.put<Response<Order>>(`${DEFAULT_PATH}/${order.id}`, order)
  }

  static async delete(orderId: number) {
    return api.delete(`${DEFAULT_PATH}/${orderId}`)
  }

  static async getOne(orderId: number) {
    return api.get<Response<Order>>(`${DEFAULT_PATH}/${orderId}`)
  }

  static async addService(orderId: number, orderService: Partial<OrderServiceModel>) {
    return api.post(`${DEFAULT_PATH}/${orderId}/orderServices`, orderService)
  }

  static async addPart(orderId: number, orderService: Partial<OrderPart>) {
    return api.post<Response<OrderPart>>(`${DEFAULT_PATH}/${orderId}/orderParts`, orderService)
  }

  static async configServiceOrder(orderId: number, serviceId: number, payload: {
    estimatedTime: number,
    partIds: number[],
    description?: string
  }) {
    return api.post(`${DEFAULT_PATH}/${orderId}/serivces/${serviceId}`, payload)
  }

  static async getOrderServices(orderId: number) {
    return api.get<Paginated<OrderServiceModel>>(`${DEFAULT_PATH}/${orderId}/orderServices`)
  }

  static async deleteOrderService(orderId: number, orderServiceId: number) {
    return api.delete(`${DEFAULT_PATH}/${orderId}/orderServices/${orderServiceId}`)
  }

  static editService(orderId: number, orderService: Partial<OrderServiceModel>) {
    return api.put(`${DEFAULT_PATH}/${orderId}/orderServices/${orderService.id}`)
  }
  
  static editPart(orderId: number, orderPart: Partial<OrderPart>) {
    return api.put(`${DEFAULT_PATH}/${orderId}/orderParts/${orderPart.id}`, orderPart)
  }

  static async getOrderParts(orderId: number) {
    return api.get<Response<{
      part: Part,
      order_part: OrderPart
    }[]>>(`${DEFAULT_PATH}/${orderId}/orderParts`)
  }

  static async deleteOrderPart(orderId: number, orderServiceId: number) {
    return api.delete(`${DEFAULT_PATH}/${orderId}/orderParts/${orderServiceId}`)
  }
}
