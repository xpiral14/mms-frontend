import api from '../Config/api'
import Company from '../Contracts/Models/Company'
import Response from '../Contracts/Types/Response'


export default class CompanyService{

  static defaultPath = '/company'


  static async get(){
    const response = await  api.get<Response<Company>>(`${this.defaultPath}`)
    const { license } = response.data.data
    response.data.data.license = {
      ...license,
      from_date: new Date(license.from_date),
      to_date: new Date(license.to_date),
    }
    return response
  }

  static async update(companyData?: Partial<Company>){
    await api.put(`${this.defaultPath}`, companyData)
    return true
  }
}
