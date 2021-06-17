import api from '../Config/api'
import Piece from '../Contracts/Models/Piece'
import Paginated from '../Contracts/Models/Paginated'

class PartsService {
  static async create(pieceData: Piece) {
    return api.post('/company/piece', pieceData)
  }

  static async getAll(page = 10, limit = 20) {
    return api.get<Paginated<Piece>>('/company/piece', {
      params: {
        page,
        limit,
      },
    })
  }
}

export default PartsService
