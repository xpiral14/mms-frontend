import api from '../Config/api'
import Product from '../Contracts/Models/Product'
import Paginated from '../Contracts/Models/Paginated'
import { ReportRequestOption } from '../Contracts/Types/Api'
import Response from '../Contracts/Types/Response'

const DEFAULT_PATH = '/products'
class ProductsService {

  static async uploadImage(productId: number, productImage: File) {
    const formData = new FormData()
    formData.append('image', productImage)
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    return api.post(`${DEFAULT_PATH}/${productId}/image`, formData, config)
  }
  static async getNextReference() {
    return (await api.get<Response<{ reference: string }>>(`${DEFAULT_PATH}/nextReference`)).data.data.reference
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
    return api.post<Response<Product>>(DEFAULT_PATH, pieceData)
  }

  static async update(pieceId: number, pieceData: Partial<Product>) {
    return api.put(`${DEFAULT_PATH}/${pieceId}`, pieceData)
  }

  static async delete(pieceId: number) {
    return api.delete(`${DEFAULT_PATH}/${pieceId}`)
  }
  static uploadProducts(formData: FormData) {
    return api.post(`${DEFAULT_PATH}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default ProductsService
