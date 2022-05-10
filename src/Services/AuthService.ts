// import axios from 'axios'
import api from '../Config/api'
import Auth from '../Contracts/Models/Auth'
import Response from '../Contracts/Types/Response'

export default class AuthService {
  public static async login(email: string, password: string) {

    // await axios.get(process.env.REACT_APP_API_SERVER_URL + '/sanctum/csrf-cookie', {withCredentials: true})
    api.defaults.headers['XSRF-TOKEN'] = 'eyJpdiI6IkNScjBsS0p1WVVPYTlmYkw0Yjllcmc9PSIsInZhbHVlIjoiQTNPTWRLUVlHWXlTemJMRWtIZG5hRXR2OG02VVFuOHV4M0tMS1E4TzJMelVuYXZ5N2RwaFB5ZDA1ZE1vY0M5STQyUjBLRXR0NHYxcE1ObW5raHFRK0FtNVg0VkZ6OVZiVGVPNVV5dFhtcUdJRURveWVvMk4ycWhNM3VtVXRjRysiLCJtYWMiOiJjMWMyMGUzZDI5N2QwZTJhZDllZmM3YWNjZDc4ODNjMTUyNDhjNTlkZDRkYWYzOGU0YzVmYjM4MmMxNjVhMWJlIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IjhFbkpnaTlpcnpJejhZMjlCdGlac3c9PSIsInZhbHVlIjoia2p1UjdBNUhHbnI3NW1xRzM1L2ttZWdTWVAwU3RlNndKV3hEcWFuUnJOZkhOVUFYWWgxZi9Yc2dVWGdZSEljcWF0dzRTYnRtZFRCay9hK3pWbnB6NVNxSXh4UTRoN0pzZ2lSWVNvcnMwSXBxUTE1dXJHSVRMVGRXWEZtK29WOTQiLCJtYWMiOiIxMWRmMDJhNzljMzBmODYwYWUyOTRhN2ViZDExYzY1ZTNhY2NiODkzMjg5YzBlZDRlN2U4ZmZiZTE0YTE4NzVhIiwidGFnIjoiIn0%3D'
    const response = await api.post<Response<Auth>>('/auth/login', {
      email,
      password,
    })

    return response.data
  }

  public static async logout() {
    await api.post('/logout')
  }

  public static async changePassword(data: {
    password: string,
    password_confirmation: string,
    token: string,
    email: string
  }) {
    await api.post<void>('/auth/change-password', data)
  }

  public static async sendPasswordEmail(data: {email: string}){
    return api.post('auth/send-password-email', data)
  }
}
