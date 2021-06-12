import api from '../Config/api'
import Costumer from '../Contracts/Models/Costumer'

export default class CostumerService {
  static DEFAULT_PATH = '/company/costumer'
  static async create(costumerData: Costumer) {
    return api.post(this.DEFAULT_PATH, costumerData)
  }
}
