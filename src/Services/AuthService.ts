// import axios from 'axios'
import api from '../Config/api'
import Auth from '../Contracts/Models/Auth'
import Response from '../Contracts/Types/Response'

export default class AuthService {
  public static async login(email: string, password: string) {
    api.defaults.baseURL = process.env.REACT_APP_API_SERVER_URL

    await api.get('/sanctum/csrf-cookie')
    api.defaults.baseURL = process.env.REACT_APP_API_SERVER_URL + '/api/v1'
    const response = await api.post<Response<Auth>>('/auth/login', {
      email,
      password,
    }, {withCredentials: true})
    return response.data
  }

  public static async logout() {
    await api.post('/logout')
  }

  public static async changePassword(data: {
    password: string
    password_confirmation: string
    token: string
    email: string
  }) {
    await api.post<void>('/auth/change-password', data)
  }

  public static async sendPasswordEmail(data: { email: string }) {
    return api.post('auth/send-password-email', data)
  }
}
