import { BillStatuses, PaymentTypes } from '../../Constants/Enums'
import Supplier from './Supplier'
import Transaction from './Transaction'

export default interface Bill {
  id: number
  name: string,
  company_id: number
  cost_center_id?: number
  supplier_id: number
  parent_id?: number,
  reference: number,
  value: number | string
  due_date?: string|Date
  opening_date?: string | Date
  installment?: number
  total_installments?: number
  annotations?: string
  status?: BillStatuses
  type: PaymentTypes
  supplier?: Supplier,
  transactions?: Transaction[]
}