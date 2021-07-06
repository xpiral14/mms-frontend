import api from '../Config/api'
import Service from '../Contracts/Models/Service'
import Paginated from '../Contracts/Models/Paginated'

class ServicesService {
  static async getAll(page = 10, limit = 20, perPage = 50) {
    return api.get<Paginated<Service>>('/company/service', {
      params: {
        page,
        limit,
        perPage
      },
    })
  }

  static async create(pieceData: Partial<Service>) {
    return api.post('/company/service', pieceData)
  }

  static async update(serviceId: number, serviceData: Service) {
    return api.put(`/company/service/${serviceId}`, {
      pieceData: serviceData,
    })
  }

  static async delete(serviceId: number) {
    return api.delete(`/company/service/${serviceId}`)
  }
}

export default ServicesService
