import Bill from './Bill'
import Transaction from './Transaction'

export default interface BillTransaction {
  id: number
  bill_id: number
  transaction_id: number
  fees?: number | string
  discount?: number | string
  addition?: number | string
  value?: number | string
  bill?: Bill
  transaction?: Transaction
}
