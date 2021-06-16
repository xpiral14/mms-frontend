import api from '../Config/api'
import Costumer from '../Contracts/Models/Costumer'
import Paginated from '../Contracts/Models/Paginated'

export default class CostumerService {
  // static DEFAULT_PATH =
  static async create(costumerData: Partial<Costumer>) {
    return api.post('/company/costumer', costumerData)
  }

  static async edit(costumerData: Partial<Costumer>) {
    return api.put(`/company/costumer/${costumerData.id}`, costumerData)
  }

  static async getAll(page = 10, limit = 20, query?: Partial<Costumer>) {
    return api.get<Paginated<Partial<Costumer>>>('/company/costumer', {
      params: {
        page,
        limit,
        ...query,
      },
    })
  }

  static async delete(costumerId: number) {
    return api.delete(`/company/costumer/${costumerId}`)
  }
}
