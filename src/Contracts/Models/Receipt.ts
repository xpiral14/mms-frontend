import ReceiptStatus from '../../Constants/ReceiptStatus'

export default interface Receipt {
  id?: number
  customerId?: number
  orderId?: number
  status: ReceiptStatus
  value: number
  date?: string | Date
  annotations?: string
  description?: string
}
