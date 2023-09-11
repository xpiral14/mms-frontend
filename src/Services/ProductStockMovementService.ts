import api from '../Config/api'
import Paginated from '../Contracts/Models/Paginated'
import ProductStock from '../Contracts/Models/ProductStock'
import ProductStockMovement from '../Contracts/Models/ProductStockMovement'
import { ReportRequestOption } from '../Contracts/Types/Api'

export default {
  getAll(productStock: Partial<ProductStock>, page = 0, limit = 20, filters?: Record<string, any>, reportType?: ReportRequestOption) {
    return api.get<Paginated<ProductStockMovement>>(`/stocks/${productStock.stock_id}/productStocks/${productStock.id}/movements`, {
      params: {
        perPage: limit,
        page: page,
        ...filters
      },
      responseType: reportType?.responseType,
      headers: {
        Accept: reportType?.mimeType ?? 'application/json'
      }
    })
  }
}
