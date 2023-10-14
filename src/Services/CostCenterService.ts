import api from '../Config/api'
import Paginated from '../Contracts/Models/Paginated'
import CostCenter from '../Contracts/Models/CostCenter'
import { ReportRequestOption } from '../Contracts/Types/Api'
import Response from '../Contracts/Types/Response'

export const DEFAULT_PATH = '/costCenters'
export default class CostCenterService {
  static async getAll(page: number, limit: number, filters?: Record<any, any>, reportType?: ReportRequestOption) {
    return api.get<Paginated<CostCenter>>(`${DEFAULT_PATH}/paginated`, {
      params: {
        page,
        perPage: limit,
        ...filters,
      },
      responseType: reportType?.responseType,
      headers: {
        Accept: reportType?.mimeType ?? 'application/json'
      }
    })
  }

  static async create(payload: Omit<CostCenter, 'id'>) {
    return api.post<Response<CostCenter>>(`${DEFAULT_PATH}`, {...payload, notCamel: true})
  }

  static async update(payload: CostCenter) {
    return api.put<Response<CostCenter>>(`${DEFAULT_PATH}/${payload.id}`, {
      ...payload,
      notCamel: true
    })
  }

  static async delete(id: number) {
    return api.delete(`${DEFAULT_PATH}/${id}`)
  }
}
