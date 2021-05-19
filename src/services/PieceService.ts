import api from '../Config/api'
import Paginated  from '../Contracts/Models/Paginated'
import Piece from '../Contracts/Models/Piece'
export default class PieceService {
    static DEFAULT_PATH = '/company/piece'

    static async getAll(page = 1, limit = 30){
      return api.get<Paginated<Piece>>(this.DEFAULT_PATH, {
        params: {
          page,
          limit
        }
      })
    }
}