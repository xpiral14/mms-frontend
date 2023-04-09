import api from '../Config/api'
import Good from '../Contracts/Models/Good'
import Paginated from '../Contracts/Models/Paginated'

export const DEFAULT_PATH = '/goods'


export default class GoodService {
  static async getAll(supplierId: number, page: number, limit: number) {
    return api.get<Paginated<Good>>(`suppliers/${supplierId}${DEFAULT_PATH}/paginated`, {
      params: {
        page,
        limit,
      },
    })
  }
}
