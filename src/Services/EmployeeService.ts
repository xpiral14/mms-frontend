import api from '../Config/api'
import Employee from '../Contracts/Models/Employee'
import Paginated from '../Contracts/Models/Paginated'

const DEFAULT_URL = '/employees'

export default class EmployeeService {
  static async create(customerData: Partial<Employee>) {
    return api.post(`${DEFAULT_URL}`, customerData)
  }

  static async edit(customerData: Partial<Employee>) {
    return api.put(`${DEFAULT_URL}/${customerData.id}`, customerData)
  }

  static async getAll(page = 10, limit = 20, query?: Partial<Employee>) {
    return api.get<Paginated<Partial<Employee>>>(`${DEFAULT_URL}/paginated`, {
      params: {
        page,
        limit,
        ...query,
      },
    })
  }

  static async delete(customerId: number) {
    return api.delete(`${DEFAULT_URL}/${customerId}`)
  }
}
