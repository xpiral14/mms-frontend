import api from '../Config/api'
import Paginated from '../Contracts/Models/Paginated'
import Unit from '../Contracts/Models/Unit'
import Response from '../Contracts/Types/Response'

export const DEFAULT_PATH = '/units'
export default class UnitService {
  static async getAll(page: number, limit: number) {
    return api.get<Paginated<Unit>>(`${DEFAULT_PATH}/paginated`, {
      params: {
        page,
        limit,
      },
    })
  }

  static async create(payload: Omit<Unit, 'id'>) {
    return api.post<Response<Unit>>(`${DEFAULT_PATH}/`, {
      name: payload.name,
      description: payload.description,
    })
  }

  static async update(payload: Unit) {
    return api.put<Response<Unit>>(`${DEFAULT_PATH}/${payload.id}`, {
      name: payload.name,
      description: payload.description,
    })
  }

  static async delete(id: number) {
    return api.delete(`${DEFAULT_PATH}/${id}`)
  }
}
