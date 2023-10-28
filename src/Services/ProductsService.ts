import api from '../Config/api'
import Product from '../Contracts/Models/Product'
import Paginated from '../Contracts/Models/Paginated'
import { ReportRequestOption } from '../Contracts/Types/Api'
import Response from '../Contracts/Types/Response'

const DEFAULT_PATH = '/products'
class ProductsService {
  static async getNextReference() {
    return (await api.get<Response<{ reference: string }>>(`${DEFAULT_PATH}/next-reference`)).data.data.reference
  }
  static async rankOfProductsBySale(page: any, limit: number, filters?: Record<string, any>, reportType?: ReportRequestOption) {
    return await api.get<Paginated<{
      'id': number,
      'reference': string,
      'name': string,
      'unit_name': string,
      'total_quantity_sold': string,
      'total_value_sold': string,
    }>>(`${DEFAULT_PATH}/reports/rankBySales`, {
      params: {
        page,
        limit,
        ...filters,
      },
      responseType: reportType?.responseType ?? 'json',
      headers: {
        Accept: reportType?.mimeType || 'application/json',
      }
    })
  }
  static async getAll(page = 10, limit = 20, filters?: Record<string, any>, reportType?: ReportRequestOption) {
    return api.get<Paginated<Product>>(`${DEFAULT_PATH}/paginated`, {
      params: {
        page,
        limit,
        ...filters,
      },
      responseType: reportType?.responseType,
      headers: {
        Accept: reportType?.mimeType
      }
    })
  }

  static async create(pieceData: Partial<Product>) {
    return api.post(DEFAULT_PATH, pieceData)
  }

  static async update(pieceId: number, pieceData: Partial<Product>) {
    return api.put(`${DEFAULT_PATH}/${pieceId}`, pieceData)
  }

  static async delete(pieceId: number) {
    return api.delete(`${DEFAULT_PATH}/${pieceId}`)
  }
}

export default ProductsService
