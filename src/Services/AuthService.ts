import api from '../Config/api'
import Auth from '../Contracts/Models/Auth'

export default class AuthService {
  public static async login(email: string, password: string) {
    const response = await api.post<Auth>('/login', {
      email,
      password,
    })

    return response.data
  }

  public static async logout() {
    await api.post('/logout')
  }
}
