import api from '../Config/api'
import Paginated from '../Contracts/Models/Paginated'
import Unit from '../Contracts/Models/Unit'

export     const DEFAULT_PATH = '/units'
export default class UnitService {

  static async  getAll(page:number, limit: number) {
    return api.get<Paginated<Unit>>(`${DEFAULT_PATH}/paginated`, {
      params: {
        page,
        limit,
      },
    })
  }
}