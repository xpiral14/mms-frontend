import { DiscountType } from '../../Constants/Enums'
import Costumer from './Costumer'
import OrderProduct from './OrderProduct'
import Service from './Service'

export default interface Order {
  id: number
  employee_id?: number
  costumer_id?: number
  status: string
  description?: string
  created_at?: string
  updated_at?: string
  order_products?: OrderProduct[]
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
