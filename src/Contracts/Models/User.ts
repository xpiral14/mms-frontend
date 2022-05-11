import { Permissions, PersonType } from '../../Constants/Enums'

type Permission = {
  id: number
  name: keyof typeof Permissions
}

type Role = {
  id: string
  name: string
  permissions: Permission[]
}

type User = {
  id: number
  company_id: number
  name?: string
  email?: string
  phone?: string
  personType: PersonType
  identification: string
  role?: Role
}

export default User
