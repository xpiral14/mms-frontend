import Costumer from './Costumer'
import OrderPiece from './OrderPiece'
import Service from './Service'
import User from './User'
import Vehicle from './Vehicle'

export default interface Order {
  id: number
  employeeId: number
  vehicleId: number
  costumerId: number
  registeredBy?: number
  canceledBy?: string
  executedBy?: string
  estimatedTime: number
  status: string
  notice?: string
  created_at: string
  updated_at: string
  userThatRegistered?: User
  vehicle?: Vehicle
  orderPiece?: OrderPiece[]
  costumer?: Costumer
  services: Service
}


export interface OrderPayload {
  costumerId: number
  servicesId: number[],
  estimatedTime: number
  notice?: string
  vehicleId?: number
} 