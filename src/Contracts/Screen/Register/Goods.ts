import { ScreenStatus } from '../../../Constants/Enums'
import ScreenProps from '../../Components/ScreenProps'

export interface GoodRegisterScreenProps extends ScreenProps {
  defaultScreenStatus?: ScreenStatus,
  supplierId: number
}
