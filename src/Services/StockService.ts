import api from '../Config/api'
import Paginated from '../Contracts/Models/Paginated'
import Stock from '../Contracts/Models/Stock'

import Response from '../Contracts/Types/Response'

export const DEFAULT_PATH = '/stocks'
export default class StockService {
  static async getAll(page: number, limit: number) {
    return api.get<Paginated<Stock>>(`${DEFAULT_PATH}/paginated`, {
      params: {
        page,
        limit,
      },
    })
  }

  static async create(payload: Omit<Stock, 'id'>) {
    return api.post<Response<Stock>>(`${DEFAULT_PATH}`, {
      name: payload.name,
      description: payload.description,
    })
  }

  static async update(payload: Stock) {
    return api.put<Response<Stock>>(`${DEFAULT_PATH}/${payload.id}`, {
      name: payload.name,
      description: payload.description,
    })
  }

  static async delete(id: number) {
    return api.delete(`${DEFAULT_PATH}/${id}`)
  }
}