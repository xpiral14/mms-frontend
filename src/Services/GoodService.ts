import api from '../Config/api'
import Good from '../Contracts/Models/Good'
import Paginated from '../Contracts/Models/Paginated'
import Response from '../Contracts/Models/Response'
import DistributedGoodProduct from '../Contracts/Models/DistributedGoodProduct'

export const DEFAULT_PATH = '/goods'


export default class GoodService {
  static async getAll(supplierId: number, page: number, limit: number) {
    return api.get<Paginated<Good>>(`suppliers/${supplierId}${DEFAULT_PATH}/paginated`, {
      params: {
        page,
        limit,
      },
    })
  }

  static async create(payload: Omit<Good, 'id'>) {
    return api.post<Response<Good>>(`suppliers/${payload.supplier_id}${DEFAULT_PATH}`, {
      receivedAt: payload.received_at,
      invoiceNumber: payload.invoice_number,
      goodProducts:  payload.good_products
    })
  }

  static async update(payload: Good) {
    return api.put<Response<Good>>(`${DEFAULT_PATH}/${payload.id}`, {
      receivedAt: payload.received_at,
      goodProducts:  payload.good_products
    })
  }

  static async createDistributedGoodProduct(goodId:number, distributedGoodProduct: Partial<DistributedGoodProduct>){
    return api.post<Response<DistributedGoodProduct>>(`${DEFAULT_PATH}/${goodId}/goodProducts/${distributedGoodProduct.goodProductId}/distributedGoodProducts`)
  }

  static async updateDistributedGoodProduct(goodId:number, distributedGoodProduct: Partial<DistributedGoodProduct>){
    return api.put<Response<DistributedGoodProduct>>(`${DEFAULT_PATH}/${goodId}/goodProducts/${distributedGoodProduct.goodProductId}/distributedGoodProducts`)
  }
}
