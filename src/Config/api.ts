import axios from 'axios'
import keysToCamel from '../Util/keysToKamel'

const api = axios.create({
  baseURL: 'http://localhost/api',
})

api.interceptors.response.use(((response : any) => {
  if (!(response.data instanceof Object)) return

  response.data = keysToCamel(response.data)

  return response
}) as any)
export default api