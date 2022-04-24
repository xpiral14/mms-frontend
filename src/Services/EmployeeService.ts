import api from '../Config/api'
import Employee from '../Contracts/Models/Employee'
import Paginated from '../Contracts/Models/Paginated'

const DEFAULT_URL = '/employees'

export default class EmployeeService {
  static async create(costumerData: Partial<Employee>) {
    return api.post(`${DEFAULT_URL}`, costumerData)
  }

  static async edit(costumerData: Partial<Employee>) {
    return api.put(`${DEFAULT_URL}/${costumerData.id}`, costumerData)
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

  static async delete(costumerId: number) {
    return api.delete(`${DEFAULT_URL}/${costumerId}`)
  }
}
