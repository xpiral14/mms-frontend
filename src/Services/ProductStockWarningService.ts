import api from '../Config/api'
import ProductStockWarning from '../Contracts/Models/ProductStockWarning'

export default class {
  static create(stockId: number, productStockWarning: Partial<ProductStockWarning>) {
    return api.post(
      `/stocks/${stockId}/productStocks/${productStockWarning.product_stock_id}/warnings`,
      productStockWarning
    )
  }
}
