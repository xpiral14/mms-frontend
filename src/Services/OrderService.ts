import api from '../Config/api'
import Order from '../Contracts/Models/Order'
import Paginated from '../Contracts/Models/Paginated'
import Response from '../Contracts/Models/Response'
import OrderServiceModel from '../Contracts/Models/OrderService'
import OrderProduct from '../Contracts/Models/OrderProduct'
import Product from '../Contracts/Models/Product'
import Service from '../Contracts/Models/Service'
import User from '../Contracts/Models/User'
import OrderStatus from '../Contracts/Models/OrderStatus'
import makeURL from '../Util/makeURL'
import Receipt from '../Contracts/Models/Receipt'

const DEFAULT_PATH = '/orders'
export type OrderServicePaginatedResponse = {
  order_service: OrderServiceModel
  service: Service
}

export type OrderProductResponse = {
  product: Product
  order_product: OrderProduct
}
export default class OrderService {
  static async getAll(page: number, limit: number, query?: object) {
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

  static async edit(order: any) {
    return api.put<Response<Order>>(`${DEFAULT_PATH}/${order.id}`, order)
  }

  static async delete(orderId: number) {
    return api.delete(`${DEFAULT_PATH}/${orderId}`)
  }

  static async getOne(orderId: number) {
    return api.get<Response<Order>>(`${DEFAULT_PATH}/${orderId}`)
  }

  static async addService(
    orderId: number,
    orderService: Partial<OrderServiceModel>
  ) {
    return api.post<Response<OrderServiceModel>>(
      `${DEFAULT_PATH}/${orderId}/orderServices`,
      orderService
    )
  }

  static async addProduct(orderId: number, orderService: Partial<OrderProduct>) {
    return api.post<Response<OrderProduct>>(
      `${DEFAULT_PATH}/${orderId}/orderProducts`,
      orderService
    )
  }

  static async configServiceOrder(
    orderId: number,
    serviceId: number,
    payload: {
      estimatedTime: number
      productIds: number[]
      description?: string
    }
  ) {
    return api.post(`${DEFAULT_PATH}/${orderId}/serivces/${serviceId}`, payload)
  }

  static async getOrderServices(orderId: number) {
    return api.get<Paginated<OrderServicePaginatedResponse>>(
      `${DEFAULT_PATH}/${orderId}/orderServices`
    )
  }

  static async deleteOrderService(orderId: number, orderServiceId: number) {
    return api.delete(
      `${DEFAULT_PATH}/${orderId}/orderServices/${orderServiceId}`
    )
  }

  static editService(
    orderId: number,
    orderService: Partial<OrderServiceModel>
  ) {
    return api.put<Response<OrderService>>(
      `${DEFAULT_PATH}/${orderId}/orderServices/${orderService.id}`,
      orderService
    )
  }

  static editProduct(orderId: number, orderProduct: Partial<OrderProduct>) {
    return api.put(
      `${DEFAULT_PATH}/${orderId}/orderProducts/${orderProduct.id}`,
      orderProduct
    )
  }

  static async getOrderProducts(orderId: number) {
    return api.get<Response<OrderProductResponse[]>>(
      `${DEFAULT_PATH}/${orderId}/orderProducts`
    )
  }

  static async deleteOrderProduct(orderId: number, orderServiceId: number) {
    return api.delete(`${DEFAULT_PATH}/${orderId}/orderProducts/${orderServiceId}`)
  }

  static async getOrderCustomer(orderId: number) {
    return api.get<Response<User>>(`${DEFAULT_PATH}/${orderId}/customer`)
  }

  static async downloadOrderResumeReport(order: Partial<Order>) {
    await api.get(`${DEFAULT_PATH}/${order.id}/reports/resume`)
   
  }

  static  async  getOrderStatuses(){
    return api.get<Response<OrderStatus[]>>(DEFAULT_PATH + '/statuses')
  }

  static async getTotalPriceOfOrder(orderId: number){
    const response = await api.get<Response<number>>(makeURL(DEFAULT_PATH, orderId, 'total-price'))

    return response.data.data
  }

  static async getOrderReceipts(orderId: number){
    return api.get<Response<Receipt[]>>(makeURL(DEFAULT_PATH, orderId, 'receipts'))
  }
}
