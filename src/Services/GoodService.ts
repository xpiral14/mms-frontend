import api from '../Config/api'
import Good from '../Contracts/Models/Good'
import Paginated from '../Contracts/Models/Paginated'
import Response from '../Contracts/Models/Response'
import DistributedGoodProduct from '../Contracts/Models/DistributedGoodProduct'
import GoodProduct from '../Contracts/Models/GoodProduct'
import { FilterType, ReportRequestOption } from '../Contracts/Types/Api'

export const DEFAULT_PATH = '/goods'


export default class GoodService {
  static deleteGoodProduct(good: Partial<Good>, selectedGoodProduct: Partial<GoodProduct>) {
    return api.delete<void>(`suppliers/${good.supplier_id}${DEFAULT_PATH}/${good.id}/goodProducts/${selectedGoodProduct.id}`)
  }
  static async getAll(supplierId: number, page: number, limit: number, filters: FilterType, reportOptions?: ReportRequestOption) {
    return api.get<Paginated<Good>>(`suppliers/${supplierId}${DEFAULT_PATH}/paginated`, {
      params: {
        page,
        limit,
        ...(filters ?? {}), 
      },
      responseType: reportOptions?.responseType ?? 'json',
      headers: {
        Accept: reportOptions?.mimeType || 'application/json'
      }
    })
  }

  static async create(payload: Omit<Good, 'id'>) {
    return api.post<Response<Good>>(`suppliers/${payload.supplier_id}${DEFAULT_PATH}`, payload)
  }

  static async update(payload: Partial<Good>) {
    return api.put<Response<Good>>(`suppliers/${payload.supplier_id}${DEFAULT_PATH}/${payload.id}`, payload)
  }

  static async delete(payload: Partial<Good>) {
    return api.delete<Response<Good>>(`suppliers/${payload.supplier_id}${DEFAULT_PATH}/${payload.id}`)
  }

  static async distributeGoodProducts(supplierId: number, goodId: number, goodsDistributions: Partial<DistributedGoodProduct>[]) {
    return api.post<Response<DistributedGoodProduct>>(`suppliers/${supplierId}${DEFAULT_PATH}/${goodId}/goodsProducts/distribute`, {
      goodsDistributions
    })
  }

  static async updateDistributedGoodProduct(goodId:number, distributedGoodProduct: Partial<DistributedGoodProduct>){
    return api.put<Response<DistributedGoodProduct>>(`${DEFAULT_PATH}/${goodId}/goodsProducts/${distributedGoodProduct.goodProductId}/distributedGoodProducts`)
  }
}
