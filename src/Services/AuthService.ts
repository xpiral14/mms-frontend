import api from '../Config/api'
import Auth from '../Contracts/Models/Auth'
import Response from '../Contracts/Models/Response'

export default class AuthService {
  public static async login(email: string, password: string) {
    await api.get('http://localhost/sanctum/csrf-cookie')    
    
    const response = await api.post<Response<Auth>>('auth/login', {
      email,
      password,
    })
    api.defaults.headers.common['HEADER_Q_EU_INVENTEI'] = `Bearer ${response.data.data.token}`
    return response.data.data
  }

  public static async logout() {
    await api.post('/logout')
  }
}
