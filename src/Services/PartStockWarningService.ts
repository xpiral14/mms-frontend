import api from '../Config/api'
import PartStockWarning from '../Contracts/Models/PartStockWarning'

export default class {
  static create(stockId: number, partStockWarning: Partial<PartStockWarning>) {
    return api.post(
      `/stocks/${stockId}/partStocks/${partStockWarning.part_stock_id}/warnings`,
      partStockWarning
    )
  }
}
