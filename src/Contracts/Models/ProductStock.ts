import Product from './Product'

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

  product?: Product
}
