import api from '../Config/api'
import Paginated from '../Contracts/Models/Paginated'
import Cost from '../Contracts/Models/Cost'
import Valuable from '../Contracts/Models/Valuable'
import Response from '../Contracts/Types/Response'
import makeURL from '../Util/makeURL'

export default class CostService {
  public static save(cost: Partial<Cost>) {
    return api.post<void>('/costs', cost)
  }

  public static update(cost: Partial<Cost>) {
    return api.put<void>(`/costs/${cost.id}` , cost)
  }

  public static getAll(page = 0, limit = 20) {
    return api.get<Paginated<Cost>>('/costs/paginated', {
      params: { limit, page: page  },
    })
  }

  public static async getCostTypes(){
    return api.get<Response<Valuable[]>>('/costs/types')
  }

  public static async delete(costId: number){
    return api.delete<void>(makeURL('costs', costId))
  }
}
