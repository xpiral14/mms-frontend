import api from '../Config/api'
import Company from '../Contracts/Models/Company'
import Response from '../Contracts/Types/Response'
import License from '../Contracts/Models/License'


export default class CompanyService {

  static defaultPath = '/company'


  static async get() {
    const response = await api.get<Response<Company>>(`${this.defaultPath}`)
    const { active_license } = response.data.data
    response.data.data.active_license = new License({
      ...active_license,
      from_date: new Date(active_license.from_date),
      to_date: new Date(active_license.to_date),
    })
    return response
  }

  static async update(companyData?: Partial<Company>) {
    await api.put(`${this.defaultPath}`, companyData)
    return true
  }
}
