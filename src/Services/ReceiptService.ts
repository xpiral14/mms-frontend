import api from '../Config/api'
import Paginated from '../Contracts/Models/Paginated'
import Receipt from '../Contracts/Models/Receipt'

export default class ReceiptService {
  public static save(receipt: Partial<Receipt>) {
    return api.post<void>('/receipts', receipt)
  }

  public static getAll(page = 0, limit = 20) {
    return api.get<Paginated<Receipt>>('/receipts/paginated', {
      params: { limit, page: page  },
    })
  }
}
