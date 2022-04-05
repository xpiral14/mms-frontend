import Costumer from './Costumer'
import OrderPart from './OrderPart'
import Service from './Service'

export default interface Order {
  id: number
  employee_id?: number
  costumer_id?: number
  executed_by?: string
  status: string
  description?: string
  created_at?: string
  updated_at?: string
  order_parts?: OrderPart[]
  costumer?: Costumer
  services?: Service[]
}
