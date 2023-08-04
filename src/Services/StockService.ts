import api from '../Config/api'
import Paginated from '../Contracts/Models/Paginated'
import Stock from '../Contracts/Models/Stock'
import { FilterType, ReportRequestOption } from '../Contracts/Types/Api'

import Response from '../Contracts/Types/Response'

export const DEFAULT_PATH = '/stocks'
export default class StockService {
  static async getAll(page: number, limit: number, filters?: FilterType, reportOptions?: ReportRequestOption) {

    return api.get<Paginated<Stock>>(`${DEFAULT_PATH}/paginated`, {
      params: {
        page,
        limit,
        ...(filters ?? {}), 
      },
      responseType: reportOptions?.responseType ?? 'json',
      headers: {
        Accept: reportOptions?.mimeType || 'application/json'
      }
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

  static async getStockThatHasProduct(productId: number) {
    return api.get<Response<Stock[]>>(`${DEFAULT_PATH}/product_stocks/products/${productId}`)
  }
}
