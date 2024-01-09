import api from '../Config/api'
import Service from '../Contracts/Models/Service'
import Paginated from '../Contracts/Models/Paginated'
import { ReportRequestOption } from '../Contracts/Types/Api'
import Response from '../Contracts/Models/Response'

const DEFAULT_PATH = '/services'

class ServicesService {
  static async getNextReference() {
    return api.get<Response<{ reference: string }>>(`${DEFAULT_PATH}/next-reference`)
  }
  static async getAll(page = 10, perPage = 20, filters?: Record<any, any>, reportType?: ReportRequestOption) {
    return api.get<Paginated<Service>>(`${DEFAULT_PATH}/paginated`, {
      params: {
        page,
        perPage,
        ...filters,
      },
      responseType: reportType?.responseType,
      headers: {
        Accept: reportType?.mimeType ?? 'application/json'
      }
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
