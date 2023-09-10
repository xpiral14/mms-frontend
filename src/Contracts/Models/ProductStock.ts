import Product from './Product'
import Stock from './Stock'

export default interface ProductStock {
  id?: number;
  company_id: number;
  stock_id: number;
  product_id: number;
  quantity: number;
  minimum: number;
  product_name?: string
  product_price?: number;
  unit_id?: number;
  unit_name?: string;
  enable_product_restocking?: boolean
  default_supplier_id?: number
  default_restock_quantity?: number
  expected_business_days?: number
  product?: Product
  stock: Stock;
}
