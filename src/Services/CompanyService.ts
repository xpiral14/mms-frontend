import api from '../Config/api'
import Company from '../Contracts/Models/Company'
import Response from '../Contracts/Types/Response'
import Paginated from '../Contracts/Models/Paginated'


export default class CompanyService {

  static defaultPath = '/company'


  static async get() {
    return await api.get<Response<Company>>(`${this.defaultPath}`)
  }

  static async update(companyData?: Partial<Company>) {
    await api.put(`${this.defaultPath}`, companyData)
    return true
  }

  static async getClientSecret() {
    return await api.get<Paginated<any>>('/company/client-secret')
  }
}
