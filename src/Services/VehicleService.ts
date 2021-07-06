import api from '../Config/api'
import Metadata from '../Contracts/Models/Metadata'
import Vehicle from '../Contracts/Models/Vehicle'

const DEFAULT_PATH = '/vehicle'
export default class VehicleService {
  static async create(vehicleData: Vehicle) {
    const response = api.post<Vehicle[]>(DEFAULT_PATH, vehicleData)

    return (await response).data
  }

  static async getAll(page: number, limit: number) {
    const response = api.get<{ meta: Metadata; data: Vehicle[] }>(
      `${DEFAULT_PATH}`,
      {
        params: {
          page,
          limit,
        },
      }
    )

    return (await response).data
  }

  static async getOne(vehicleId: number) {
    const response = api.get<Vehicle>(`${DEFAULT_PATH}/${vehicleId}`)
    return (await response).data
  }

  static async update(vehicleId?: number, vehicleData?: Vehicle) {
    await api.put(`${DEFAULT_PATH}/${vehicleId}`, vehicleData)
    return true
  }

  static async delete(vehicleId?: number) {
    await api.delete(`${DEFAULT_PATH}/${vehicleId}`)
    return true
  }
}
