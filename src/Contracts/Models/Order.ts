import Costumer from './Costumer'
import OrderPart from './OrderPart'
import Service from './Service'
import User from './User'
import Vehicle from './Vehicle'

export default interface Order {
  id: number
  employee_id: number
  vehicle_id: number
  costumer_id: number
  registered_by?: number
  canceled_by?: string
  executed_by?: string
  estimated_time: number
  status: string
  notice?: string
  created_at: string
  updated_at: string
  user_that_registered?: User
  vehicle?: Vehicle
  order_part?: OrderPart[]
  costumer?: Costumer
  services: Service[]
}


export interface OrderPayload {
  costumerId: number
  description?: string
  partIds: number[],
  serviceIds: number[]
}
