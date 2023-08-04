import api from '../Config/api'
import Customer from '../Contracts/Models/Customer'
import Paginated from '../Contracts/Models/Paginated'

const DEFAULT_URL = '/customers'
export default class CustomerService {
  static async create(customerData: Partial<Customer>) {
    return api.post(`${DEFAULT_URL}`, customerData)
  }

  static async edit(customerData: Partial<Customer>) {
    return api.put(`${DEFAULT_URL}/${customerData.id}`, customerData)
  }

  static async getAll(page = 10, limit = 20, query?: Partial<Customer>) {
    return api.get<Paginated<Partial<Customer>>>(`${DEFAULT_URL}/paginated`, {
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
