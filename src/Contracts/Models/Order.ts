import Costumer from './Costumer'
import Service from './Service'

export default interface Order {
  id: number
  employeeId: number
  costumerId: number
  registeredBy?: number
  status: string
  description?: string
  costumer?: Costumer
  services: Service[]
}


export interface OrderPayload {
  costumerId: number
  servicesId: number[],
  description?: string
  vehicleId?: number
} 