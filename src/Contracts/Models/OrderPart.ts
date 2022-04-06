import Part from './Part'

export default interface OrderPart {
  id: number
  order_id: number
  part_id: number
  quantity?: number
  created_at?: string
  updated_at?: string
  part?: Part
  replaced_price?: number
  description?: string
}
