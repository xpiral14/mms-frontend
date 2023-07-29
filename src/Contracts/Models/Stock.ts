import ProductStock from './ProductStock'

export default interface Stock {
  id: number,
  name: string
  description?: string
  product_stocks?: ProductStock[]
}
