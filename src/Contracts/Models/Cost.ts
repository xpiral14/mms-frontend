import { CostType } from '../../Constants/Enums'

export default interface Cost {
  id?: number;
  value: number;
  orderId?: number;
  customerId?: number
  date: string;
  type: CostType;
  description?: string;
  annotation?: string
} 
