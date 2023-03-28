import Product from './Product'

export default interface OrderProduct {
  id: number
  order_id: number
  product_id: number;
  product_name?:string;
  product_unit_name?:string;
  product_unit_id?:number;
  product_stock_id?: number;
  product_price?: number;
  quantity?: number
  created_at?: string
  updated_at?: string
  product?: Product
  replaced_price?: number
  description?: string
}
