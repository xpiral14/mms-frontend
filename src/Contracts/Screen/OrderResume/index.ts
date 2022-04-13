import { Screen, SubScreenProps } from '../../Components/ScreenProps'
import Order from '../../Models/Order'
export interface OrderResumeProps {
  onClose?: (screen: Screen) => void
  order?: Partial<Order>
}


export default interface OrderResumeScreenProps extends SubScreenProps, OrderResumeProps {}
