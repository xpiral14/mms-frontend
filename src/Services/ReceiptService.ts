import api from '../Config/api'
import Paginated from '../Contracts/Models/Paginated'
import Receipt from '../Contracts/Models/Receipt'
import Valuable from '../Contracts/Models/Valuable'
import Response from '../Contracts/Types/Response'

export default class ReceiptService {
  public static save(receipt: Partial<Receipt>) {
    return api.post<void>('/receipts', receipt)
  }

  public static update(receipt: Partial<Receipt>) {
    return api.put<void>(`/receipts/${receipt.id}` , receipt)
  }

  public static getAll(page = 0, limit = 20) {
    return api.get<Paginated<Receipt>>('/receipts/paginated', {
      params: { limit, page: page  },
    })
  }

  public static async getReceiptStatuses(){
    return api.get<Response<Valuable[]>>('/receipts/statuses')
  }
}
