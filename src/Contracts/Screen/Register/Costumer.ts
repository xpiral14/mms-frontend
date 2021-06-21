import { ScreenStatus } from '../../../Constants/Enums'
import ScreenProps from '../../Components/ScreenProps'
import Costumer from '../../Models/Costumer'

export interface CostumerRegisterScreenProps extends ScreenProps {
  defaultCostumer?: Partial<Costumer>
  defaultScreenStatus?: ScreenStatus
}
