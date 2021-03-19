import api from '../Config/api'
import Metadata from '../Contracts/Models/Metadata'
import Costumer from '../Contracts/Models/Costumer'

export default class CostumerService {
  static defaultPath = '/company/costumer'

  static async create(costumerData: Costumer) {
    const response = await api.post<Costumer[]>(`${this.defaultPath}`, costumerData)

    return (response).data
  }

  static async getAll(page: number, limit: number) {
    const response = await api.get<{ meta: Metadata; data: Costumer[] }>(
      `${this.defaultPath}`,
      {
        params: {
          page,
          limit,
        },
      }
    )

    return (response).data
  }

  static async getOne(costumerId: number) {
    const response = await api.get<Costumer>(`${this.defaultPath}/${costumerId}`)
    return (response).data
  }

  static async update(costumerId?: number, costumerData?: Costumer) {
    await api.put(`${this.defaultPath}/${costumerId}`, costumerData)
    return true
  }

  static async delete(costumerId?: number) {
    await api.delete(`${this.defaultPath}/${costumerId}`)
    return true
  }
}
