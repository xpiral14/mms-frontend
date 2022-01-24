import { PersonType } from '../../Constants/Enums'

export default interface Costumer {
  id: number
  roleId: number
  companyId: number
  registeredBy: number
  updatedBy?: any
  name: string
  email?: any
  phone: string
  cnpj?: any
  cpf?: any
  created_at: string
  updated_at: string
  personType?: PersonType
}
