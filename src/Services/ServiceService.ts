import api from '../Config/api'

export default class {
  static async getAll(page = 1, perPage = 20) {
    return api.get('/service', {
      params: {
        page,
        perPage,
      },
    })
  }
}
