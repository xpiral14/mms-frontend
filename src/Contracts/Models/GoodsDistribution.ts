export default interface GoodsDistribution {
  id: number
  good_id: number
  good_product_id: number
  product_stock_id: number
  quantity: number
  user_id: number
  stock_id?: number
}
