import api from '../Config/api'
import Paginated from '../Contracts/Models/Paginated'
import PartStock from '../Contracts/Models/PartStock'
import Response from '../Contracts/Types/Response'

export const DEFAULT_PATH = '/stocks'
export default class PartStockService {
  static async getAll(stockId:number, page: number, limit: number) {
    return api.get<Paginated<PartStock>>(`${DEFAULT_PATH}/${stockId}/partStocks/paginated`, {
      params: {
        page,
        limit,
      },
    })
  }

  static async create(payload: Omit<PartStock, 'id'>) {
    return api.post<Response<PartStock>>(`${DEFAULT_PATH}/${payload.stock_id}/partStocks`, {
      quantity: payload.quantity,
      minimum: payload.minimum ?? 1,
      part_id: payload.part_id
    })
  }

  static async update(payload: PartStock) {
    return api.put<Response<PartStock>>(`${DEFAULT_PATH}/${payload.stock_id}/partStocks/${payload.id}`, {
      quantity: payload.quantity,
      minimum: payload.minimum,
    })
  }

  static async delete(stockId:number, id: number) {
    return api.delete(`${DEFAULT_PATH}/${stockId}/partStocks/${id}`)
  }
}
