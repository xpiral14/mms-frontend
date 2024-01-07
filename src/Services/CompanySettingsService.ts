import api from '../Config/api'
import CompanySetting from '../Contracts/Models/CompanySettings'
import Response from '../Contracts/Types/Response'

export default {
  saveCompanySetting: (companySetting: any) => {
    return api.put<Response<CompanySetting>>('/settings', {
      ...companySetting,
      notCamel: true
    })
  },
  getCompanySetting: () => {
    return api.get<Response<CompanySetting>>('/settings')
  }
}
