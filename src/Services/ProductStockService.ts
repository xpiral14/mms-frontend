import api from '../Config/api'
import Paginated from '../Contracts/Models/Paginated'
import ProductStock from '../Contracts/Models/ProductStock'
import Response from '../Contracts/Types/Response'

export const DEFAULT_PATH = '/stocks'
export default class ProductStockService {
  static async getAll(stockId:number, page: number, limit: number) {
    return api.get<Paginated<ProductStock>>(`${DEFAULT_PATH}/${stockId}/productStocks/paginated`, {
      params: {
        page,
        limit,
      },
    })
  }

  static async create(payload: Omit<ProductStock, 'id'>) {
    return api.post<Response<ProductStock>>(`${DEFAULT_PATH}/${payload.stock_id}/productStocks`, payload)
  }

  static async update(payload: ProductStock) {
    return api.put<Response<ProductStock>>(`${DEFAULT_PATH}/${payload.stock_id}/productStocks/${payload.id}`, payload)
  }

  static async delete(stockId:number, id: number) {
    return api.delete(`${DEFAULT_PATH}/${stockId}/productStocks/${id}`)
  }
}
