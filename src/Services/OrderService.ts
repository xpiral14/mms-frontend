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
import { ReportRequestOption } from '../Contracts/Types/Api'

const DEFAULT_PATH = '/orders'
export type OrderServicePaginatedResponse = {
  order_service: OrderServiceModel
  service: Service
}

export interface OrderProductProfit {
  reference: string;
  id: number;
  product_name: string;
  unit_price: number;
  total_value_sale: number;
  total_quantity_sale: string;
  avg_value: number;
  profit: number;
  profit_percent: number;
}


export type ProfitResumeResponse = {
  total_profit: 0,
  total_sale: 0,
  total_profit_percent: 0,
  order_products: Record<string, OrderProductProfit>
}

export type OrderProductResponse = {
  product: Product
  order_product: OrderProduct
}
export default class OrderService {
  static async getNextReference() {
    return api.get<Response<{ reference: string }>>(`${DEFAULT_PATH}/nextReference`)
  }
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

  static async getOrderStatuses() {
    return api.get<Response<OrderStatus[]>>(DEFAULT_PATH + '/statuses')
  }

  static async getTotalPriceOfOrder(orderId: number) {
    const response = await api.get<Response<number>>(makeURL(DEFAULT_PATH, orderId, 'totalPrice'))

    return response.data.data
  }

  static async getOrderReceipts(orderId: number) {
    return api.get<Response<Receipt[]>>(makeURL(DEFAULT_PATH, orderId, 'receipts'))
  }

  static async getOrderProfitResume(orderId: number) {
    return api.get<Response<ProfitResumeResponse>>(makeURL(DEFAULT_PATH, orderId, 'reports', 'profitResume'))
  }
  static async rankOfProductsBySale(page: any, limit: number, filters?: Record<string, any>, reportType?: ReportRequestOption) {
    return await api.get<Paginated<{
      'id': number,
      'reference': string,
      'name': string,
      'unit_name': string,
      'total_quantity_sold': string,
      'total_value_sold': string,
    }>>(`${DEFAULT_PATH}/reports/rankBySales`, {
      params: {
        page,
        limit,
        ...filters,
      },
      responseType: reportType?.responseType ?? 'json',
      headers: {
        Accept: reportType?.mimeType || 'application/json',
      }
    })
  }
  static async salesByCustomer(page: any, limit: number, filters?: Record<string, any>, reportType?: ReportRequestOption) {
    return await api.get<Paginated<{
      customer_name: string;
      total_sold: number;
      first_sale: string;
      last_sale: string;
    }
    >>(`${DEFAULT_PATH}/reports/salesByCustomer`, {
      params: {
        page,
        limit,
        ...filters,
      },
      responseType: reportType?.responseType ?? 'json',
      headers: {
        Accept: reportType?.mimeType || 'application/json',
      }
    })
  }
}
