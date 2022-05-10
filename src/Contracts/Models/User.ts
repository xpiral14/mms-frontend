import { PersonType } from '../../Constants/Enums'

type User = {
  id: number
  company_id: number
  name?: string
  email?: string
  phone?: string
  personType: PersonType
  identification: string
}

export default User
