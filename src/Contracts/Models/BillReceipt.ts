import { BillReceiptStatuses, PaymentTypes } from '../../Constants/Enums'
import Supplier from './Supplier'
import Transaction from './Transaction'

export default interface BillReceipt {
  id: number
  name: string,
  company_id: number
  cost_center_id?: number
  supplier_id: number
  parent_id?: number,
  reference: number,
  value: number | string
  due_date?: string
  opening_date?: string
  installment?: number
  annotations?: string
  status?: BillReceiptStatuses
  type: PaymentTypes
  supplier?: Supplier,
  transactions?: Transaction[]
}
