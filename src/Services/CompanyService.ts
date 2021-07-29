import api from '../Config/api'
import Company from '../Contracts/Models/Company'


export default class CompanyService{

  static defaultPath = '/company'
  static async getAll(){
    const response =  api.get<Company[]>(this.defaultPath)

    return (await response).data
  }

  static async getOne(companyId: number){
    const response =  api.get<Company>(`${this.defaultPath}/${companyId}`)
    return (await response).data
  }

  static async update(companyId?: number, companyData?: Company){
    await api.put(`${this.defaultPath}/${companyId}`, companyData)
    return true
  }
}
