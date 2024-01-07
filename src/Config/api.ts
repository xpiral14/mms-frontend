import axios from 'axios'
import { USER_TIMEZONE_NAME } from '../Constants'
import keysToCamel from '../Util/keysToKamel'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_SERVER_URL + '/api/v1',
  headers: { Accept: 'application/json' },
  withCredentials: true,
})

api.interceptors.request.use((value => {
  value.headers['X-USER-TIMEZONE'] = USER_TIMEZONE_NAME
  const { notCamel, ...data } = value?.data ?? {}
  if (notCamel) {
    value.data = data
    return value
  }
  value.data = keysToCamel(data)
  return value
}))


export const cepApi = axios.create({
  baseURL: 'https://viacep.com.br/ws'
})

export default api
