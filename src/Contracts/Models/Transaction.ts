export default interface Transaction {
  id: string
  company_id: number
  bank_account_id?: number
  value: number
  type: string
  category: string
  annotation: string
  created_at: string
  updated_at: string
  deleted_at: string
}
