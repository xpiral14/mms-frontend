import api from '../Config/api'
import Paginated from '../Contracts/Models/Paginated'
import Unit from '../Contracts/Models/Unit'
import { ReportRequestOption } from '../Contracts/Types/Api'
import Response from '../Contracts/Types/Response'

export const DEFAULT_PATH = '/units'
export default class UnitService {
  static async getAll(page: number, limit: number, filters?: Record<any, any>, reportType?: ReportRequestOption) {
    return api.get<Paginated<Unit>>(`${DEFAULT_PATH}/paginated`, {
      params: {
        page,
        limit,
        ...filters,
      },
      responseType: reportType?.responseType,
      headers: {
        Accept: reportType?.mimeType ?? 'application/json'
      }
    })
  }

  static async create(payload: Omit<Unit, 'id'>) {
    return api.post<Response<Unit>>(`${DEFAULT_PATH}`, {
      name: payload.name,
      description: payload.description,
    })
  }

  static async update(payload: Unit) {
    return api.put<Response<Unit>>(`${DEFAULT_PATH}/${payload.id}`, {
      name: payload.name,
      description: payload.description,
    })
  }

  static async delete(id: number) {
    return api.delete(`${DEFAULT_PATH}/${id}`)
  }
}
