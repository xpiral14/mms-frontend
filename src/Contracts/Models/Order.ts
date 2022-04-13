import { DiscountType } from '../../Constants/Enums'
import Costumer from './Costumer'
import OrderPart from './OrderPart'
import Service from './Service'

export default interface Order {
  id: number
  employee_id?: number
  costumer_id?: number
  status: string
  description?: string
  created_at?: string
  updated_at?: string
  order_parts?: OrderPart[]
  costumer?: Costumer
  services?: Service[]
  validity?: string,
  date?: string
  reference?: string,
  service_discount_type?: DiscountType
  product_discount_type?: DiscountType
  service_discount?: number
  product_discount?: number
}
