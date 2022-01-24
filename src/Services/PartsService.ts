import api from '../Config/api'
import Piece from '../Contracts/Models/Piece'
import Paginated from '../Contracts/Models/Paginated'

const DEFAULT_PATH = '/parts'
class PartsService {
  static async getAll(page = 10, limit = 20) {
    return api.get<Paginated<Piece>>(`${DEFAULT_PATH}/paginated`, {
      params: {
        page,
        limit,
      },
    })
  }

  static async create(pieceData: Partial<Piece>) {
    return api.post(DEFAULT_PATH, pieceData)
  }

  static async update(pieceId: number, piece: Piece) {
    return api.put(`${DEFAULT_PATH}/${pieceId}`, {
      name: piece.name,
      description: piece.description,
      price: piece.price,
      unitId: piece.unitId
    })
  }

  static async delete(pieceId: number) {
    return api.delete(`${DEFAULT_PATH}/${pieceId}`)
  }
}

export default PartsService
