import api from '../Config/api'
import Costumer from '../Contracts/Models/Costumer'
import Paginated from '../Contracts/Models/Paginated'

export default class CostumerService {
  // static DEFAULT_PATH = 
  static async create(costumerData: Costumer) {
    return api.post('/company/costumer', costumerData)
  }
  static async getAll(page = 10, limit = 20, query?: Costumer) {
    return api.get<Paginated<Costumer>>('/company/costumer', {
      params: {
        page,
        limit,
        ...query
      },
    })
  }
}
