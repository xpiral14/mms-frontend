import { ScreenStatus } from '../../../Constants/Enums'
import ScreenProps from '../../Components/ScreenProps'
import Stock from '../../Models/Stock'

export interface ProductStockProps {
  stock: Partial<Stock>
  defaultScreenStatus?: ScreenStatus
}

export default interface ProductStockScreenProps
  extends ProductStockProps,
    ScreenProps {
    }
