import Good from './Good'
import Product from './Product'

export default interface GoodProduct {
  id?: number
  product_id: number
  good_id: number
  quantity: number
  value: number

  product: Partial<Product>
  good: Partial<Good>
}
