import api from '../Config/api'
import Metadata from '../Contracts/Models/Metadata'
import Order from '../Contracts/Models/Order'

export default class OrderService {
  static DEFAULT_PATH = '/company/order'

  static async getAll() {
    return api.get<Metadata<Order[]>>(this.DEFAULT_PATH)
  }

  static async getOne(orderId:number){
    return api.get<Order>(`${this.DEFAULT_PATH}/${orderId}`)
  }
}
