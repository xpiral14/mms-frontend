import api from '../Config/api'
import User from '../Contracts/Models/User'

type LoginResponse = {
  type: string
  token: string
  expires_at: string,
  user: User
}
export default class AuthService {
  public static async login(email: string, password: string) {
    const response = await api.post<LoginResponse>('/login', {
      email,
      password,
    })

    return response.data
  }

  public static async logout(){
    await api.post('/logout')
  }
}
