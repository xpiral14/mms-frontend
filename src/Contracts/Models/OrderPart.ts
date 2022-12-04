import Part from './Part'

export default interface OrderPart {
  id: number
  order_id: number
  part_id: number;
  part_name?:string;
  part_unit_name?:string;
  part_unit_id?:number;
  part_stock_id?: number;
  part_price?: number;
  quantity?: number
  created_at?: string
  updated_at?: string
  part?: Part
  replaced_price?: number
  description?: string
}
