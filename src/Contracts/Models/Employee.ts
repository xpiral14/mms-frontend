import { PersonType } from '../../Constants/Enums'

export default interface Employee {
  id: number
  roleId: number
  companyId: number
  registeredBy: number
  updatedBy?: any
  name: string
  email?: any
  phone: string
  identification: string
  created_at: string
  updated_at: string
  personType?: PersonType
}
