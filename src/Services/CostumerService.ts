import api from '../Config/api'
import Costumer from '../Contracts/Models/Costumer'
import Paginated from '../Contracts/Models/Paginated'

const DEFAULT_URL = '/costumer'
export default class CostumerService {
  static async create(costumerData: Partial<Costumer>) {
    return api.post(`${DEFAULT_URL}`, costumerData)
  }

  static async edit(costumerData: Partial<Costumer>) {
    return api.put(`${DEFAULT_URL}/${costumerData.id}`, costumerData)
  }

  static async getAll(page = 10, limit = 20, query?: Partial<Costumer>) {
    return api.get<Paginated<Partial<Costumer>>>(`${DEFAULT_URL}`, {
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
