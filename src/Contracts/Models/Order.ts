import { DiscountType } from '../../Constants/Enums'
import Customer from './Customer'
import OrderProduct from './OrderProduct'
import Service from './Service'
import Product from './Product'
import OrderService from './OrderService'

export default interface Order {
  id: number
  employee_id?: number
  customer_id?: number
  status: string
  description?: string
  created_at?: string
  updated_at?: string
  order_products?: OrderProduct[]
  order_services?: OrderService[]
  customer?: Customer
  services?: Service[]
  products?: Product[]
  validity?: string,
  date?: string
  reference?: string,
  service_discount_type?: DiscountType
  product_discount_type?: DiscountType
  service_discount?: number
  product_discount?: number
  send_notification_when_concluded?: boolean
}
