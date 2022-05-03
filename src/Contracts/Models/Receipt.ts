export default interface Receipt {
  id?: number
  customerId?: number
  orderId?: number
  value: number
  date?: string | Date
  annotations?: string
  description?: string
}
