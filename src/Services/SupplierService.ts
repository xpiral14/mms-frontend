import api from '../Config/api'
import Supplier from '../Contracts/Models/Supplier'
import Paginated from '../Contracts/Models/Paginated'
import { ReportRequestOption } from '../Contracts/Types/Api'

const DEFAULT_URL = '/suppliers'
export default class SupplierService {
  static async performanceReport(page: any, limit: number, filters?: Record<string, any>, reportType?: ReportRequestOption) {
    return api.get(`${DEFAULT_URL}/reports/performance`, {
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
  static async create(supplierData: Partial<Supplier>) {
    return api.post(`${DEFAULT_URL}`, supplierData)
  }

  static async edit(supplierData: Partial<Supplier>) {
    return api.put(`${DEFAULT_URL}/${supplierData.id}`, supplierData)
  }

  static async getAll(page = 10, limit = 20, query?: Partial<Supplier>) {
    return api.get<Paginated<Partial<Supplier>>>(`${DEFAULT_URL}/paginated`, {
      params: {
        page,
        limit,
        ...query,
      },
    })
  }

  static async delete(supplierId: number) {
    return api.delete(`${DEFAULT_URL}/${supplierId}`)
  }
}
