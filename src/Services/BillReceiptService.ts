import api from '../Config/api'
import Paginated from '../Contracts/Models/Paginated'
import BillReceipt from '../Contracts/Models/BillReceipt'
import Transaction from '../Contracts/Models/Transaction'
import { ReportRequestOption } from '../Contracts/Types/Api'
import Response from '../Contracts/Types/Response'
import { Enum } from '../Contracts/Models/Generics'

export type MonthSummary = {
  opened?: number
  received?: number
  expired?: number,
  partially_paid_expired?: number
  partially_paid?: number
}

export const DEFAULT_PATH = '/billReceipts'
export default {
  async getAll(page: number, perPage: number, filters?: Record<any, any>, reportType?: ReportRequestOption) {
    return api.get<Paginated<BillReceipt>>(`${DEFAULT_PATH}/paginated`, {
      params: {
        page,
        perPage,
        ...filters,
      },
      responseType: reportType?.responseType,
      headers: {
        Accept: reportType?.mimeType ?? 'application/json'
      }
    })
  },

  async create(payload: Omit<Partial<BillReceipt>, 'id'>) {
    return api.post<Response<BillReceipt>>(`${DEFAULT_PATH}`, {
      ...payload,
      notCamel: true
    })
  },

  async update(payload: BillReceipt) {
    return api.put<Response<BillReceipt>>(`${DEFAULT_PATH}/${payload.id}`, {
      ...payload,
      notCamel: true
    })
  },

  async delete(id: number) {
    return api.delete(`${DEFAULT_PATH}/${id}`)
  },
  async getPaymentTypes() {
    return api.get<Response<Enum[]>>(`${DEFAULT_PATH}/payments/types`)
  },

  async payBillReceipt(billReceiptId: number, transaction: Partial<Transaction>) {
    return api.post<Response<Transaction>>(`${DEFAULT_PATH}/${billReceiptId}/payments`, { ...transaction, notCamel: true })
  },

  async getMonthSummary(date: string) {
    return api.get<Response<MonthSummary>>(`${DEFAULT_PATH}/summary`, { params: { date } })
  },
  async getTotalBillReceiptsBySuppliers(page: any, limit: number, filters?: Record<string, any>, reportType?: ReportRequestOption) {
    return api.get(`${DEFAULT_PATH}/reports/totalBillReceiptsBySuppliers`, {
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
  },

  async getBillReceiptsPaymentsHistory(page: any, limit: number, filters?: Record<string, any>, reportType?: ReportRequestOption) {
    return api.get(`${DEFAULT_PATH}/reports/billReceiptPayments`, {
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
  },
  async getNextReference() {
    return api.get<Response<{ reference: string }>>(`${DEFAULT_PATH}/nextReference`)
  }
}
