import api from '../Config/api'
import Metadata from '../Contracts/Models/Metadata'
import Vehicle from '../Contracts/Models/Vehicle'

export default class VehicleService {
  static defaultPath = '/company/vehicle'

  static async create(vehicleData: Vehicle) {
    const response = api.post<Vehicle[]>(`${this.defaultPath}`, vehicleData)

    return (await response).data
  }

  static async getAll(page: number, limit: number) {
    const response = api.get<{ meta: Metadata; data: Vehicle[] }>(
      `${this.defaultPath}`,
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
    const response = api.get<Vehicle>(`${this.defaultPath}/${vehicleId}`)
    return (await response).data
  }

  static async update(vehicleId?: number, vehicleData?: Vehicle) {
    await api.put(`${this.defaultPath}/${vehicleId}`, vehicleData)
    return true
  }

  static async delete(vehicleId?: number) {
    await api.delete(`${this.defaultPath}/${vehicleId}`)
    return true
  }
}
