import api from '../Config/api'
import Company from '../Contracts/Models/Company'
import Response from '../Contracts/Types/Response'


export default class CompanyService{

  static defaultPath = '/company'


  static async get(){
    return api.get<Response<Company>>(`${this.defaultPath}`)
  }

  static async update(companyData?: Partial<Company>){
    await api.put(`${this.defaultPath}`, companyData)
    return true
  }
}
