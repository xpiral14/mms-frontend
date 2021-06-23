import api from '../Config/api'
import Piece from '../Contracts/Models/Piece'
import Paginated from '../Contracts/Models/Paginated'

class PartsService {
  static async getAll(page = 10, limit = 20) {
    return api.get<Paginated<Piece>>('/company/piece', {
      params: {
        page,
        limit,
      },
    })
  }

  static async create(pieceData: Partial<Piece>) {
    return api.post('/company/piece', pieceData)
  }

  static async update(pieceId: number, pieceData: Piece) {
    return api.put(`/company/piece/${pieceId}`, {
      pieceData,
    })
  }

  static async delete(pieceId: number) {
    return api.delete(`/company/piece/${pieceId}`)
  }
}

export default PartsService
