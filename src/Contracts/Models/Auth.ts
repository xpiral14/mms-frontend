import User from './User'

export default interface Auth {
  user: User
  token: string
  type: string
}
