import axios from 'axios'
import keysToCamel from '../Util/keysToKamel'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER_URL + '/api/v1',
})

api.interceptors.request.use((value => {
  value.data = keysToCamel(value.data)
  return value
}))

export default api
