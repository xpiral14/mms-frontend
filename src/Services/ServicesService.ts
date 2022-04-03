import api from '../Config/api'
import Service from '../Contracts/Models/Service'
import Paginated from '../Contracts/Models/Paginated'

const DEFAULT_PATH = '/services'

class ServicesService {
  static async getAll(page = 10, limit = 20) {
    return api.get<Paginated<Service>>(`${DEFAULT_PATH}/paginated`, {
      params: {
        page,
        limit,
      },
    })
  }

  static async create(serviceData: Partial<Service>) {
    return api.post(`${DEFAULT_PATH}`, serviceData)
  }

  static async update(serviceId: number, serviceData: Service) {
    return api.put(`${DEFAULT_PATH}/${serviceId}`, serviceData)
  }

  static async delete(serviceId: number) {
    return api.delete(`${DEFAULT_PATH}/${serviceId}`)
  }
}

export default ServicesService
