import api from '../Config/api'
import Paginated from '../Contracts/Models/Paginated'
import Service from '../Contracts/Models/Service'

export default  class ReportService {
  static async getAll(page = 1, perPage = 20) {
    return api.get<Paginated<Service>>('/reports/paginated', {
      params: {
        page,
        perPage,
      },
    })
  }
}
