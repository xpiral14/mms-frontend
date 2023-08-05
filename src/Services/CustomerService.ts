import api from '../Config/api'
import Customer from '../Contracts/Models/Customer'
import Paginated from '../Contracts/Models/Paginated'
import { ReportRequestOption } from '../Contracts/Types/Api'

const DEFAULT_URL = '/customers'
export default class CustomerService {
  static async create(customerData: Partial<Customer>) {
    return api.post(`${DEFAULT_URL}`, customerData)
  }

  static async edit(customerData: Partial<Customer>) {
    return api.put(`${DEFAULT_URL}/${customerData.id}`, customerData)
  }

  static async getAll(page = 10, limit = 20, filters?: Record<string, any>, reportType?: ReportRequestOption) {
    return api.get<Paginated<Partial<Customer>>>(`${DEFAULT_URL}/paginated`, {
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

  static async delete(customerId: number) {
    return api.delete(`${DEFAULT_URL}/${customerId}`)
  }
}
