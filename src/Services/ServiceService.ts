import api from '../Config/api'

export default class {
  static async getAll(page = 1, limit = 20) {
    return api.get('/services/paginated', {
      params: {
        page,
        limit,
      },
    })
  }
}
