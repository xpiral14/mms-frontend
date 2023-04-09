import { ScreenStatus } from '../../../Constants/Enums'
import ScreenProps from '../../Components/ScreenProps'
import Supplier from '../../Models/Supplier'

export interface SupplierRegisterScreenProps extends ScreenProps {
  defaultSupplier?: Partial<Supplier>
  defaultScreenStatus?: ScreenStatus
}
