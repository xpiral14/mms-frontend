import api from '../Config/api'
import Part from '../Contracts/Models/Part'
import Paginated from '../Contracts/Models/Paginated'

const DEFAULT_PATH = '/parts'
class PartsService {
  static async getAll(page = 10, limit = 20) {
    return api.get<Paginated<Part>>(`${DEFAULT_PATH}/paginated`, {
      params: {
        page,
        limit,
      },
    })
  }

  static async create(pieceData: Partial<Part>) {
    return api.post(DEFAULT_PATH, pieceData)
  }

  static async update(pieceId: number, pieceData: Part) {
    return api.put(`${DEFAULT_PATH}/${pieceId}`, pieceData)
  }

  static async delete(pieceId: number) {
    return api.delete(`${DEFAULT_PATH}/${pieceId}`)
  }
}

export default PartsService
