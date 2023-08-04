import DistributedGoodProduct from './DistributedGoodProduct'
import Good from './Good'
import GoodsDistribution from './GoodsDistribution'
import Product from './Product'

export default interface GoodProduct {
  id: number
  product_id: number
  good_id: number
  quantity: number
  value: number
  has_distributed: boolean
  product: Partial<Product>
  good: Partial<Good>
  distributedGoodProduct: DistributedGoodProduct[]
  goods_distribution: GoodsDistribution[]
}
