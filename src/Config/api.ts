import axios from 'axios'
import keysToCamel from '../Util/keysToKamel'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER_URL + '/api/v1',
  headers: { Accept: 'application/json' },
  withCredentials: true,
})

api.interceptors.request.use((value => {
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
