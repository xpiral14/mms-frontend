import GoodProduct from './GoodProduct'

export default interface Good {
  id?: number;
  invoice_number: string
  supplier_id: number
  received_at: string|Date
  distributed_at: string|Date|null
  requested_at?: string|Date|null
  good_products: GoodProduct[]
}
