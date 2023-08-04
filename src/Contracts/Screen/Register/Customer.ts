import { ScreenStatus } from '../../../Constants/Enums'
import ScreenProps from '../../Components/ScreenProps'
import Customer from '../../Models/Customer'

export interface CustomerRegisterScreenProps extends ScreenProps {
  defaultCustomer?: Partial<Customer>
  defaultScreenStatus?: ScreenStatus
}
