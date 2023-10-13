export default interface Transaction {
  id: string
  bank_account_id: number,
  type: string,
  category: string,
  payment_type: string,
  annotation: string,
  value: number | string,
  fees: number | string,
  discount: number | string,
  addition: number | string,
  created_at: string
  updated_at: string
  deleted_at: string
}
